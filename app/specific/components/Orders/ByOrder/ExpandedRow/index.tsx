
import ExpandedRow from '@root/app/_components/Table/ExpandedRow';
// import OrderEditor from '@root/app/specific/components/Orders/ByOrder/Order';
// import OrderEditorButtons from '@root/app/specific/components/Orders/ByOrder/Order/EditorButtons';
import OrderView from '@root/app/specific/components/Orders/ByOrder/Order/View';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import { useSession } from 'next-auth/react';

const OrderExpandedRow = () => {

    const {
        rowClick: { expandedRowId },
        // order: {
        //     consumerPicker: {
        //         open: consumersPickerOpen,
        //     },
        //     deadlines,
        // }
    } = useOrderTableContext();

    const { data: session } = useSession();
    const role = session?.user.roleId;
    // const isClient = role === 'client';
    const isManager = role === 'manager';
    const isKitchen = role === 'kitchen';

    const Wrapper = expandedRowId ? ExpandedRow : 'div';

    return (<Wrapper>
        {/* {isClient ? <Deadline /> : null} */}
        {/* {isClient ? <OrderEditor /> : null} */}
        {/* {isClient && deadlines.second.canOrder && !consumersPickerOpen ? <OrderEditorButtons /> : null} */}
        {isManager || isKitchen ? <OrderView /> : null}
    </Wrapper>
    );
}



export default OrderExpandedRow;