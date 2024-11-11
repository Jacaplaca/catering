import { type UpdateMessageType } from '@root/app/hooks/useMessage';
import { api } from '@root/app/trpc/react';
import { useBoolean } from 'usehooks-ts'

const useRemoveOrder = ({
    onSuccess, ids, updateMessage
}: {
    onSuccess: () => unknown,
    ids: string[],
    updateMessage: UpdateMessageType
}) => {
    const { value: isConfirmationOpen, setTrue: show, setFalse: hide } = useBoolean(false)

    const removeRemoveCall = api.specific.order.deleteMany.useMutation({
        onSuccess: () => {
            onSuccess();
            updateMessage('removed');
        },
        onError: (error) => {
            console.log(error.data, error.message, error.shape);
        },
        onSettled: () => {
            hide();
        }
    });

    const action = () => {
        removeRemoveCall.mutate({ ids });
    }

    return {
        action,
        isConfirmationOpen,
        show,
        hide,
        questionKey: 'shared:delete_confirmation'
    }

};

export default useRemoveOrder;
