import InputStandard from '@root/app/_components/ui/Inputs/Standard';
import translate from '@root/app/lib/lang/translate';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import Deadline from '@root/app/specific/components/Orders/ByOrder/Order/Deadline';
import LastOrderInfo from '@root/app/specific/components/Orders/ByOrder/Order/LastOrderInfo';
import OrderMatrix from '@root/app/specific/components/Orders/ByOrder/Order/Matrix';
import OrderDatePicker from '@root/app/specific/components/Orders/ByOrder/Order/OrderDatePicker';
import { useEffect, type FC } from 'react';

const Order: FC = () => {

    const {
        dictionary,
        rowClick: {
            orderForEdit,
            expandedRowId
        },
        order: {
            consumerPicker: {
                setOpen: setConsumersPickerOpen,
            },
            lastOrder,
            note,
            updateNote
        },
    } = useOrderTableContext();

    useEffect(() => {
        setConsumersPickerOpen(null);
    }, []);

    return <div className="flex flex-col gap-2 sm:gap-4 py-2 sm:py-4">
        {orderForEdit ? <Deadline /> : <OrderDatePicker />}
        <OrderMatrix />
        <InputStandard
            id={`order-note`}
            type="text"
            isTextArea
            placeholder={translate(dictionary, 'orders:order_input_note')}
            maxLength={1000}
            onChange={(e) => {
                updateNote(e.target.value);
            }}
            className={`w-full dark:bg-transparent
                    `}
            value={note}
        />
        {expandedRowId ? null : lastOrder ? <LastOrderInfo day={lastOrder.day} dictionary={dictionary} /> : null}
    </div>
}

export default Order;