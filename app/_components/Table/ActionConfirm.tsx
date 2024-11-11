import ConfirmationModal from '@root/app/_components/Modals/Confirmation';
import translate from '@root/app/lib/lang/translate';
import { type FunctionComponent } from 'react';

const TableActionConfirm: FunctionComponent<{
    dictionary: Record<string, string>;
    getData: () => {
        action: () => void;
        isConfirmationOpen: boolean;
        show: () => void;
        hide: () => void;
        questionKey: string
    }
}> = ({
    dictionary,
    getData
}) => {
        const {
            questionKey,
            isConfirmationOpen,
            hide,
            action
        } = getData();
        return (
            <ConfirmationModal
                question={translate(dictionary, questionKey)}
                isModalOpen={isConfirmationOpen}
                hide={hide}
                confirmAction={action}
                dictionary={dictionary}
            />
        )
    };

export default TableActionConfirm;