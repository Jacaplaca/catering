
import ExpandedRow from '@root/app/_components/Table/ExpandedRow';
import { ClientMonthReportTable } from '@root/app/specific/components/Orders/ByClientAndMonth/ExpandedRow/ClientMonthReportTable';
import { useByClientAndMonthTableContext } from '@root/app/specific/components/Orders/ByClientAndMonth/context';

const OrderMonthExpandedRow = () => {

    const {
        row: { monthData, fetching, clientId },
    } = useByClientAndMonthTableContext();


    const Wrapper = clientId ? ExpandedRow : 'div';

    return (<Wrapper>
        {fetching ? <div
            className='flex justify-center items-center h-full p-10'><i className='fas fa-spinner fa-spin text-3xl' /></div> : (
            monthData && <ClientMonthReportTable />
        )}
    </Wrapper>
    );
}



export default OrderMonthExpandedRow;