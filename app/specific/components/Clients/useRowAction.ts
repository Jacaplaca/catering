import useTableCheckbox from '@root/app/hooks/table/useTableCheckbox';
import useActivateClient from '@root/app/specific/components/Clients/actions/useActivate';
import useRemoveClient from '@root/app/specific/components/Clients/actions/useRemove';
import { type TableActionType } from '@root/types';
import { useState } from 'react';

const useClientAction = ({
    rows,
    onSuccess,
}: {
    rows: string[],
    onSuccess: () => unknown,
}) => {
    const { idsChecked, toggleCheck, checkAllOnPage, uncheckAll, isAllChecked } = useTableCheckbox(rows);

    const [activeAction, setActiveAction] = useState<'remove' | 'activate' | null>(null);

    const remove = useRemoveClient({ onSuccess, ids: idsChecked })
    const activate = useActivateClient({ onSuccess, ids: idsChecked })

    const showConfirmation = (type: 'remove' | 'activate') => {
        switch (type) {
            case 'remove':
                remove.show();
                setActiveAction('remove');
                break;
            case 'activate':
                activate.show();
                setActiveAction('activate');
                break;
            default:
                break;
        }
    }

    const getConfirmationData = () => {
        switch (activeAction) {
            case 'remove':
                return remove;
            case 'activate':
                return activate;
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
            label: 'clients:activate_button',
            key: 'activate',
            icon: 'fas fa-lightbulb-on',
            onClick: () => showConfirmation('activate')
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

export default useClientAction;