import useTableCheckbox from '@root/app/hooks/table/useTableCheckbox';
import translate from '@root/app/lib/lang/translate';
import useRemoveUser from '@root/app/specific/components/Users/actions/useRemove';
import { useState } from 'react';

const useUserAction = ({
    rows,
    onSuccess,
    dictionary,
}: {
    rows: string[],
    onSuccess: () => unknown,
    dictionary: Record<string, string>
}) => {
    const { idsChecked, toggleCheck, checkAllOnPage, uncheckAll, isAllChecked } = useTableCheckbox(rows);

    const [activeAction, setActiveAction] = useState<'remove' | null>(null);

    const remove = useRemoveUser({ onSuccess, ids: idsChecked })

    const showConfirmation = (type: 'remove') => {
        switch (type) {
            case 'remove':
                remove.show();
                setActiveAction('remove');
                break;
            default:
                break;
        }
    }

    const getConfirmationData = () => {
        switch (activeAction) {
            case 'remove':
                return remove;
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

    const actions = [
        {
            label: translate(dictionary, 'shared:delete_selected'),
            icon: 'fas fa-trash',
            onClick: () => showConfirmation('remove')
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

export default useUserAction;