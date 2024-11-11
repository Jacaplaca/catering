import { type ClientFileType } from '@prisma/client';
import { api } from '@root/app/trpc/react';
import { type ClientFilesCustomTable } from '@root/types/specific';
import { useEffect, useState } from 'react';
import { type z } from 'zod';
import { saveClientsFiles } from '@root/app/validators/specific/clientFiles';
import { type PredefinedMessageType, type UpdateMessageType } from '@root/app/hooks/useMessage';
import translate from '@root/app/lib/lang/translate';

const FormSchema = saveClientsFiles;

function useUploadFiles({
    updateRow,
    updateMessage,
    dictionary,
    day,
}: {
    updateRow: (row: ClientFilesCustomTable) => void,
    updateMessage: UpdateMessageType,
    dictionary: Record<string, string>,
    day: Date,
}) {

    const utils = api.useUtils();

    const [clientId, setClientId] = useState<string | null>(null);

    const { data: client } = api.specific.clientFiles.getOne.useQuery({ clientId: clientId ?? '', day },
        {
            enabled: !!clientId
        }
    );

    useEffect(() => {
        if (client) {
            updateRow(client);
        }
    }, [client]);

    const onSave = (values: z.infer<typeof FormSchema>) => {
        updateMessage('saving');
        saveClientFiles.mutate(values);
    };

    const onSuccess = async ({ affectedClientIds, messageType }: {
        affectedClientIds: string[],
        messageType: PredefinedMessageType
    }) => {
        if (affectedClientIds.length === 1 && affectedClientIds[0]) {
            setClientId(affectedClientIds[0]);
        } else {
            await utils.specific.clientFiles.count.invalidate();
            await utils.specific.clientFiles.getMany.invalidate();
        }
        updateMessage(messageType);
    }

    const saveClientFiles = api.specific.clientFiles.save.useMutation({
        onSuccess: async ({ affectedClientIds }) => await onSuccess({ affectedClientIds, messageType: 'saved' }),
        onError: (error) => {
            updateMessage({ content: translate(dictionary, error.message), status: 'error' });
        },
    });

    const onRemove = (ids: string[]) => {
        updateMessage('saving');
        removeClientFiles.mutate({ ids });
    }

    const removeClientFiles = api.specific.clientFiles.remove.byId.useMutation({
        onSuccess: async ({ affectedClientIds }) => await onSuccess({ affectedClientIds, messageType: 'removed' }),
        onError: (error) => {
            updateMessage({ content: translate(dictionary, error.message), status: 'error' });
        },
    });

    const [uploadInProgress, setUploadInProgress] = useState<{ userId: string, type: ClientFileType } | null>(null);

    const setUploadInProgressTrue = (userId: string, type: ClientFileType) => {
        setUploadInProgress({ userId, type });
    }

    const setUploadInProgressFalse = () => {
        setUploadInProgress(null);
    }

    return {
        uploadInProgress,
        setUploadInProgressTrue,
        setUploadInProgressFalse,
        onSave,
        onRemove,
    }
}

export default useUploadFiles;
