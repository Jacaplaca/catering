'use client';

import tableTheme from '@root/app/_components/Table/theme';
import TableColumns from '@root/app/_components/Table/Columns';
import TableContent from '@root/app/_components/Table/Content';
import TableFooter from '@root/app/_components/Table/Footer';
import TableHeader from '@root/app/_components/Table/Header.tsx';
import { type FunctionComponent } from "react";
import TableWrapper from '@root/app/_components/Table/Wrapper';
import { Table } from 'flowbite-react';
import TableToast from '@root/app/_components/Table/Toast';
import { useOrderByMonthTableContext } from '@root/app/specific/components/Orders/ByMonth/context';
import OrderMonthExpandedRow from '@root/app/specific/components/Orders/ByMonth/ExpandedRow';

const OrdersByMonthTable: FunctionComponent = () => {

    const {
        pageName,

        lang,
        dictionary,
        data: { table, skeleton },
        columns,
        isFetching,
        totalCount,
        row: { deliveryMonth, onClick },
        sort: { sortName, sortDirection },
        message
    } = useOrderByMonthTableContext();


    const clickable = true;

    return (
        <div className='relative'>
            <TableWrapper>
                <TableHeader
                    // search={search}
                    dictionary={dictionary}
                    title={'orders:title'}
                    searchPlaceholder={'orders:search_placeholder'}
                >
                </TableHeader>

                <Table
                    theme={tableTheme}
                    hoverable
                >
                    <TableColumns
                        columns={columns}
                        sortName={sortName}
                        sortDirection={sortDirection}
                        dictionary={dictionary}
                    />
                    <TableContent
                        tableData={isFetching ? skeleton : table}
                        className="divide-y"
                        key={isFetching ? 'skeleton' : 'table'}
                        onRowClick={clickable ? onClick : undefined}
                        expandedRowId={deliveryMonth}
                        ExpandedRow={OrderMonthExpandedRow}
                    />
                </Table>
                <TableFooter
                    totalCount={totalCount}
                    pageName={pageName}
                    lang={lang}
                    dictionary={dictionary}
                />
            </TableWrapper>
            <TableToast
                message={message?.messageObj}
                onClose={message?.resetMessage}
            />
        </div>
    );
}


export default OrdersByMonthTable;