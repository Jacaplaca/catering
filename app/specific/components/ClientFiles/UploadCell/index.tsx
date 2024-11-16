import { type ClientFileType } from '@prisma/client';
import TableActionConfirm from '@root/app/_components/Table/ActionConfirm';
import ProgressBar from '@root/app/_components/ui/ProgressBar';
import { useClientFilesTableContext } from '@root/app/specific/components/ClientFiles/context';
import useGrouper from '@root/app/specific/components/ClientFiles/useGrouper';
import { type ClientFilesCustomTable } from '@root/types/specific';
import Link from 'next/link';
import { useCallback, useEffect, useState, type FC } from 'react';

const UploadCell: FC<{
    files: ClientFilesCustomTable['menu'] | ClientFilesCustomTable['checklist'] | ClientFilesCustomTable['diets']
    clientId: string
    clientFileType: ClientFileType
}> = ({ files, clientId, clientFileType }) => {

    const firstFile = files?.[0] ?? {};
    const { id: fileId, s3Key: fileS3Key } = firstFile as { id: string, s3Key: string };

    const {
        dictionary,
        settings,
        uploadFiles: {
            uploadInProgress,
            setUploadInProgressTrue,
            setUploadInProgressFalse,
            onSave,
            onRemove
        },
        message: { updateMessage },
        filter: { week }
    } = useClientFilesTableContext();

    const {
        upload,
        dropzone
    } = useGrouper({
        clientFiles: settings.clientFiles,
        updateMessage,
        dictionary,
        clientId,
        clientFileType,
        onSave,
        day: week.dayOfWeek
    });

    const submit = useCallback(async () => {
        if (dropzone.acceptedFiles.length > 0 && upload.presignedUrls.data?.length) {
            setUploadInProgressTrue(clientId, clientFileType);
            await upload.onSubmit();
            upload.setPreviewAttachments({});
            upload.setUploadComplete(false);
            setUploadInProgressFalse();
        }
    }, [
        dropzone.acceptedFiles,
        clientId,
        clientFileType,
        setUploadInProgressTrue,
        setUploadInProgressFalse,
        upload
    ]);

    useEffect(() => {
        if (dropzone.acceptedFiles.length > 0 && upload.presignedUrls.data?.length && !upload.uploading) {
            void submit();
        }
    }, [upload.presignedUrls, dropzone.acceptedFiles, upload.uploading, submit]);

    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const getConfirmationData = () => {
        return {
            questionKey: 'shared:delete_confirmation',
            isConfirmationOpen,
            hide: () => { setIsConfirmationOpen(false) },
            action: () => { onRemove([fileId]) },
            show: () => { setIsConfirmationOpen(true) }
        }
    }

    const handleRemove = () => {
        setIsConfirmationOpen(true);
    }

    if (fileId && fileS3Key) {
        return <div className={`flex gap-6 items-center justify-center
        text-neutral-800
        dark:text-neutral-200
        `}>
            <div className='absolute top-0 right-0'>

                <TableActionConfirm
                    dictionary={dictionary}
                    getData={getConfirmationData}
                />
            </div>
            <Link href={`file/${fileS3Key}`} target='_blank'>
                <i className="fa-solid fa-file-circle-check text-base text-secondary-accent dark:text-secondary-accent-dark" />
            </Link>
            <button onClick={handleRemove}>
                <i className="fa-solid fa-trash-can text-base opacity-50" />
            </button>
        </div>
    }

    if (uploadInProgress) {
        return <div className='p-1 px-2 h-full'>
            <ProgressBar
                size={'xl'}
                progress={Math.round(upload.totalProgressPercent)}
                labelText={false}
            />
        </div>
    }

    return (<div
        {...dropzone.getRootProps({
            className: 'p-1'
        })}
    >
        <div className={`
                flex justify-center items-center h-full w-full cursor-pointer p-1
                rounded-md
                bg-neutral-100 text-neutral-400
                dark:bg-neutral-800 dark:text-neutral-300
                border-2 border-dashed
                outline-none transition-colors duration-300
                ${dropzone.isFocused ? 'border-blue-500' : 'border-neutral-200 dark:border-neutral-600'}
                ${dropzone.isDragAccept ? 'border-green-500' : ''}
                ${dropzone.isDragReject ? 'border-red-500' : ''}
                ${uploadInProgress ? 'opacity-50 pointer-events-none' : ''}
            `}>

            {uploadInProgress ? null : <input {...dropzone.getInputProps()} />}
            <i className="fa-solid fa-cloud-arrow-up text-2xl" />
        </div>
    </div>
    )
}

export default UploadCell;
