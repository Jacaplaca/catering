import useTableCheckbox from '@root/app/hooks/table/useTableCheckbox';
import { type UpdateMessageType } from '@root/app/hooks/useMessage';
import useComplete from '@root/app/specific/components/Orders/ByOrder/actions/useComplete';
import useRemoveOrder from '@root/app/specific/components/Orders/ByOrder/actions/useRemove';
import { type TableActionType } from '@root/types';
import { type Session } from 'next-auth';
import { useState } from 'react';

const useOrderAction = ({
    rows,
    session,
    onSuccess,
    updateMessage
}: {
    rows: string[],
    session: Session | null,
    onSuccess: () => unknown,
    updateMessage: UpdateMessageType
}) => {
    const role = session?.user.roleId;
    const isClient = role === 'client';
    const { idsChecked, toggleCheck, checkAllOnPage, uncheckAll, isAllChecked } = useTableCheckbox(rows);

    type ActionType = 'remove' | 'complete';
    const [activeAction, setActiveAction] = useState<ActionType | null>(null);

    const remove = useRemoveOrder({ onSuccess, ids: idsChecked, updateMessage })
    const complete = useComplete({ onSuccess, ids: idsChecked })
    const showConfirmation = (type: ActionType) => {

        switch (type) {
            case 'remove':
                remove.show();
                setActiveAction('remove');
                break;
            case 'complete':
                complete.show();
                setActiveAction('complete');
                break;
            default:
                break;
        }
    }

    const getConfirmationData = () => {
        switch (activeAction) {
            case 'remove':
                return remove;
            case 'complete':
                return complete;
            default:
                return {
                    questionKey: '',
                    isConfirmationOpen: false,
                    hide: () => { return },
                    action: () => { return },
                    show: () => { return }
                }
        }
    }

    const actions: TableActionType[] = [
        {
            label: 'shared:delete_selected',
            key: 'remove',
            icon: 'fas fa-trash',
            onClick: () => showConfirmation('remove')
        },
        {
            label: 'orders:complete_order_button',
            key: 'complete',
            icon: 'fas fa-check',
            onClick: () => showConfirmation('complete'),
            hidden: isClient
        }
    ]

    const showActions = idsChecked.length > 0;

    return {
        getConfirmationData,
        actions,
        showActions,
        idsChecked,
        checkAllOnPage,
        isAllChecked,
        toggleCheck,
        uncheckAll
    }

};

export default useOrderAction;