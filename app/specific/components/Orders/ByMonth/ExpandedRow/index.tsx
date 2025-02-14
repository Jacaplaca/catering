
import ExpandedRow from '@root/app/_components/Table/ExpandedRow';
import { useOrderByMonthTableContext } from '@root/app/specific/components/Orders/ByMonth/context';
import { ConsumerMonthReportTable } from '@root/app/specific/components/Orders/ByMonth/ExpandedRow/ConsumerMonthReportTable';

const OrderMonthExpandedRow = () => {

    const {
        row: { monthData, fetching, deliveryMonth },
    } = useOrderByMonthTableContext();


    const Wrapper = deliveryMonth ? ExpandedRow : 'div';

    return (<Wrapper>
        {fetching ? <div
            className='flex justify-center items-center h-full p-10'><i className='fas fa-spinner fa-spin text-3xl' /></div> : (
            monthData && <ConsumerMonthReportTable />
        )}
    </Wrapper>
    );
}



export default OrderMonthExpandedRow;