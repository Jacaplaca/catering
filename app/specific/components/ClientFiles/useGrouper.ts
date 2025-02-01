import { type ClientFileType } from '@prisma/client';
import { type UpdateMessageType } from '@root/app/hooks/useMessage';
import useUpload from '@root/app/hooks/useUpload';
import translate from '@root/app/lib/lang/translate';
import formatFileSize from '@root/app/specific/lib/formatFileSize';
import { api } from '@root/app/trpc/react';
import { type saveClientsFiles } from '@root/app/validators/specific/clientFiles';
import { type SettingParsedType } from '@root/types';
import { type ChangeEvent, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useBoolean } from 'usehooks-ts';
import { type z } from 'zod';

const useGrouper = ({ clientFiles, updateMessage, dictionary, clientId, clientFileType, onSave, day }: {
    clientFiles: SettingParsedType,
    updateMessage: UpdateMessageType,
    dictionary: Record<string, string>,
    clientId?: string,
    clientFileType?: ClientFileType,
    day: Date,
    onSave: (data: z.infer<typeof saveClientsFiles>) => void
}) => {
    const prefix = clientFiles['s3-prefix'] as string;
    const maxFileSize = clientFiles['max-file-size'] as number;
    const [fileTypeOpened, setFileTypeOpened] = useState<ClientFileType | null>(clientFileType ?? null);
    const [clientsPicked, setClientsPicked] = useState<{ id: string, name: string, code: string }[]>(clientId ? [{ id: clientId, name: '', code: '' }] : []);
    const { value: savingDisabled, setValue: setSavingDisabled } = useBoolean(true);


    const onUploadComplete = ({ key, fileName }: { key: string, fileName: string }) => {
        if (clientsPicked[0]?.id && fileTypeOpened) {
            onSave({
                day,
                clientIds: clientsPicked.map(c => c.id),
                fileType: fileTypeOpened,
                s3ObjectKeys: [key],
                fileName: fileName
            });
        }
    };

    const upload = useUpload(prefix, onUploadComplete);
    const {
        previewAttachments,
        uploading,
        onFilesChange,
        totalProgressPercent,
        setPreviewAttachments,
        presignedUrls,
        setUploadComplete
    } = upload;

    const dropzone = useDropzone({
        maxFiles: 1,
        multiple: false,
        maxSize: maxFileSize,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFilesChange({ target: { files: acceptedFiles } } as unknown as ChangeEvent<HTMLInputElement>);
            }
        },
        onDropRejected: (fileRejections) => {
            fileRejections.forEach((fileRejection) => {
                if (fileRejection.errors[0]?.code === 'file-too-large') {
                    updateMessage({
                        content: translate(dictionary, 'shared:max_file_size', [formatFileSize(maxFileSize)]),
                        status: 'error',
                        timeout: 5000
                    });
                }
            });
        },
    });

    const { data: allClients } = api.specific.client.getActiveWithCode.useQuery();

    const pickClient = (id: string | null, allIds: { id: string, name: string, code: string }[]) => {
        if (id) {
            setClientsPicked(prev => {
                const isAlreadyPicked = prev.some(client => client.id === id);
                if (isAlreadyPicked) {
                    return prev.filter(client => client.id !== id);
                } else {
                    return [...prev, ...allIds.filter(c => c.id === id)];
                }
            });
        }
    }

    const selectAll = () => {
        setClientsPicked(allClients ?? []);
    }

    const deselectAll = () => {
        setClientsPicked([]);
    }

    const reset = () => {
        setPreviewAttachments({});
        setUploadComplete(false);
        setClientsPicked([]);
    }

    const openFileType = (type: ClientFileType) => {
        reset();
        setFileTypeOpened(type);
    }

    const closeFileType = () => {
        setFileTypeOpened(null);
    }


    useEffect(() => {
        if (Object.keys(previewAttachments).length > 0 && fileTypeOpened && clientsPicked.length > 0 && !uploading && presignedUrls.data?.length) {
            setSavingDisabled(false);
        } else {
            setSavingDisabled(true);
        }
    }, [previewAttachments, fileTypeOpened, clientsPicked, uploading, presignedUrls.data, setSavingDisabled]);

    return {
        fileTypeOpened,
        openFileType,
        closeFileType,
        isOpened: !!fileTypeOpened,
        clientsPicked,
        pickClient,
        allClients,
        selectAll,
        deselectAll,
        upload,
        dropzone,
        savingDisabled,
        previewAttachments,
        reset,
        totalProgressPercent
    }
}

export default useGrouper;
