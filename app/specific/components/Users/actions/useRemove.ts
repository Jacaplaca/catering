import { api } from '@root/app/trpc/react';
import { useBoolean } from 'usehooks-ts'

const useRemoveClient = ({
    onSuccess, ids,
}: {
    onSuccess: () => unknown,
    ids: string[],
}) => {
    const { value: isConfirmationOpen, setTrue: show, setFalse: hide } = useBoolean(false)

    const removeUsersCall = api.user.remove.useMutation({
        onSuccess: () => {
            show();
            onSuccess();
        },
        onError: (error) => {
            hide();
            console.log(error.data, error.message, error.shape);
        }
    });

    const action = () => {
        removeUsersCall.mutate({ ids });
    }

    return {
        action,
        isConfirmationOpen,
        show,
        hide,
        questionKey: 'shared:delete_confirmation'
    }

};

export default useRemoveClient;
