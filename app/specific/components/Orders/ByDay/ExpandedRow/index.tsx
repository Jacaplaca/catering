
import ExpandedRow from '@root/app/_components/Table/ExpandedRow';
import { useOrderByDayTableContext } from '@root/app/specific/components/Orders/ByDay/context';
import Diet from '@root/app/specific/components/Orders/ByDay/ExpandedRow/Diet';
import SummaryStandard from '@root/app/specific/components/Orders/ByDay/ExpandedRow/SummaryStandard';

const OrderDayExpandedRow = () => {

    const {
        row: { dayId, fetching },
    } = useOrderByDayTableContext();


    const Wrapper = dayId ? ExpandedRow : 'div';

    return (<Wrapper>

        {fetching ? <div className='flex justify-center items-center h-full p-10'><i className='fas fa-spinner fa-spin text-3xl' /></div> : (
            <>
                <SummaryStandard />
                <Diet />
            </>
        )}


    </Wrapper>
    );
}



export default OrderDayExpandedRow;