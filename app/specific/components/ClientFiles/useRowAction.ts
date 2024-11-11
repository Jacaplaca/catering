import useTableCheckbox from '@root/app/hooks/table/useTableCheckbox';
import { UpdateMessageType } from '@root/app/hooks/useMessage';
import useRemoveClientFiles from '@root/app/specific/components/ClientFiles/actions/useRemove';
import { type TableActionType } from '@root/types';
import { useState } from 'react';

const useClientFilesAction = ({
    rows,
    day,
    onSuccess,
    updateMessage,
}: {
    rows: string[],
    day: Date,
    onSuccess: () => unknown,
    updateMessage: UpdateMessageType,
}) => {
    const { idsChecked, toggleCheck, checkAllOnPage, uncheckAll, isAllChecked } = useTableCheckbox(rows);

    const [activeAction, setActiveAction] = useState<'removeAll' | 'removeAllSelected' | 'removeMenuSelected' | 'removeChecklistSelected' | 'removeDietsSelected' | null>(null);

    const remove = useRemoveClientFiles({ onSuccess, day, updateMessage })

    const showConfirmation = (type: 'removeAll' | 'removeAllSelected' | 'removeMenuSelected' | 'removeChecklistSelected' | 'removeDietsSelected') => {
        remove.show();
        setActiveAction(type);
    }

    const getConfirmationData = () => {
        switch (activeAction) {
            case 'removeAll':
                return {
                    ...remove,
                    questionKey: 'client-files:delete_confirmation_all_week_files_question',
                    action: () => remove.action({})
                };
            case 'removeAllSelected':
                return {
                    ...remove,
                    questionKey: 'client-files:delete_confirmation_all_files_selected_question',
                    action: () => remove.action({ clientIds: idsChecked })
                };
            case 'removeMenuSelected':
                return {
                    ...remove,
                    questionKey: 'client-files:delete_confirmation_menu_files_selected_question',
                    action: () => remove.action({ clientIds: idsChecked, fileType: 'menu' })
                };
            case 'removeChecklistSelected':
                return {
                    ...remove,
                    questionKey: 'client-files:delete_confirmation_checklist_files_selected_question',
                    action: () => remove.action({ clientIds: idsChecked, fileType: 'checklist' })
                };
            case 'removeDietsSelected':
                return {
                    ...remove,
                    questionKey: 'client-files:delete_confirmation_diet_files_selected_question',
                    action: () => remove.action({ clientIds: idsChecked, fileType: 'diets' })
                };
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
            label: 'client-files:delete_confirmation_all_files_selected_button',
            key: 'removeAllSelected',
            icon: 'fas fa-trash',
            onClick: () => showConfirmation('removeAllSelected')
        },
        {
            label: 'client-files:delete_confirmation_menu_files_selected_button',
            key: 'removeMenuSelected',
            icon: 'fas fa-trash',
            onClick: () => showConfirmation('removeMenuSelected')
        },
        {
            label: 'client-files:delete_confirmation_checklist_files_selected_button',
            key: 'removeChecklistSelected',
            icon: 'fas fa-trash',
            onClick: () => showConfirmation('removeChecklistSelected')
        },
        {
            label: 'client-files:delete_confirmation_diet_files_selected_button',
            key: 'removeDietsSelected',
            icon: 'fas fa-trash',
            onClick: () => showConfirmation('removeDietsSelected')
        },
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
        uncheckAll,
        showConfirmation
    }

};

export default useClientFilesAction;