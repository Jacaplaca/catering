import { type ClientFileType } from '@prisma/client';
import { type UpdateMessageType } from '@root/app/hooks/useMessage';
import { api } from '@root/app/trpc/react';
import { useBoolean } from 'usehooks-ts'

const useRemoveFiles = ({
    onSuccess,
    day,
    updateMessage,
}: {
    onSuccess: () => unknown,
    day: Date,
    updateMessage: UpdateMessageType,
}) => {
    const { value: isConfirmationOpen, setTrue: show, setFalse: hide } = useBoolean(false)

    const { mutate: removeFiles } = api.specific.clientFiles.remove.byTypeAndClientIds.useMutation({
        onSuccess: () => {
            onSuccess();
            updateMessage('removed');
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
            updateMessage('error')
        },
        onSettled: () => {
            hide();
        }
    });

    const action = ({
        fileType,
        clientIds,
    }: {
        fileType?: ClientFileType,
        clientIds?: string[],
    }) => {
        removeFiles({ day, fileType, clientIds });
        updateMessage('removing');
    }

    return {
        action,
        isConfirmationOpen,
        show,
        hide,
    }

};

export default useRemoveFiles;
