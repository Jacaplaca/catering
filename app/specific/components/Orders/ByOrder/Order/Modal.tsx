import MainModal from '@root/app/_components/Modals/MainModal';
import translate from '@root/app/lib/lang/translate';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import Order from '@root/app/specific/components/Orders/ByOrder/Order';
import OrderEditorButtons from '@root/app/specific/components/Orders/ByOrder/Order/EditorButtons';
import { type FC } from 'react';

type OrderModalProps = {
    isOpen: boolean;
    closeModal: () => void;
}

const OrderModal: FC<OrderModalProps> = ({ isOpen, closeModal }) => {

    const { dictionary,
        order: { error,
            consumerPicker: {
                open: consumersPickerOpen,
                close: closeConsumersPicker
            }
        }
    } = useOrderTableContext();


    return <MainModal
        width={750}
        isOpen={isOpen}
        closeModal={consumersPickerOpen ? undefined : closeModal}
        closeTooltip={consumersPickerOpen
            ? translate(dictionary, 'orders:back_to_order_button')
            : translate(dictionary, 'orders:no_save_warning')}
        header={translate(dictionary, 'orders:create_order')}
        message={error ? translate(dictionary, error) : undefined}
        customCloseIcon={consumersPickerOpen ? <i className="fas fa-backward mx-1 text-xl" /> : undefined}
        customCloseAction={consumersPickerOpen ? closeConsumersPicker : undefined}
        disallowBackdropClose
        isError={true}
        footer={
            consumersPickerOpen ? null : <OrderEditorButtons />
        }
        footerColor={`border-t dark:border-darkmode-modal-separator border-modal-separator
        bg-neutral-200 dark:bg-neutral-700`}
    >
        <Order />
    </MainModal>
}

export default OrderModal;