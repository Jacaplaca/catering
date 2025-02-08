'use client';

import tableTheme from '@root/app/_components/Table/theme';
import TableColumns from '@root/app/_components/Table/Columns';
import TableContent from '@root/app/_components/Table/Content';
import TableFooter from '@root/app/_components/Table/Footer';
import TableHeader from '@root/app/_components/Table/Header.tsx';
import QuickFilterRow from '@root/app/_components/Table/QuickFilterRow';
import t from '@root/app/lib/lang/translate';
import { useEffect, type FunctionComponent } from "react";
import RowActions from '@root/app/_components/Table/Actions';
import TableWrapper from '@root/app/_components/Table/Wrapper';
import TableActionConfirm from '@root/app/_components/Table/ActionConfirm';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { Table } from 'flowbite-react';
import { useOrderTableContext } from '@root/app/specific/components/Orders/ByOrder/context';
import OrderModal from '@root/app/specific/components/Orders/ByOrder/Order/Modal';
import { useSession } from 'next-auth/react';
import { OrderStatus, RoleType } from '@prisma/client';
import ClientDropdown from '@root/app/specific/components/ui/Dropdown/Client';
import OrderStatusSelect from '@root/app/specific/components/ui/OrderStatusSelect';
import TagSearch from '@root/app/specific/components/ui/TagSearch';
import TableToast from '@root/app/_components/Table/Toast';
import OrderExpandedRow from '@root/app/specific/components/Orders/ByOrder/ExpandedRow';
import useBreakpoint from '@root/app/hooks/useBreakpoint';
import { useBoolean } from 'usehooks-ts';

const OrdersTable: FunctionComponent = () => {

    const {
        pageName,
        lang,
        dictionary,
        data: { table, skeleton },
        columns: { columns, showColumns, toggleColumn },
        isFetching,
        totalCount,
        rowClick: { expandedRowId, onRowClick },
        sort: { sortName, sortDirection },
        action: {
            showActions,
            isAllChecked,
            checkAllOnPage,
            getConfirmationData,
            actions
        },
        orderModal: { isOpen: isAddOrderOpen, open: openOrderModal, close: addOrderClose },
        filter: {
            clients: { clientForFilter, chooseClient },
            status: { statusForFilter, chooseStatus },
            tags: { updateTagId },
        },
        message
    } = useOrderTableContext();

    const { value: isTableShown, setTrue: showTable, setFalse: hideTable } = useBoolean(true);

    const breakpoint = useBreakpoint();

    useEffect(() => {
        if ((breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md') && isAddOrderOpen) {
            hideTable();
        } else {
            showTable();
        }
    }, [breakpoint, isAddOrderOpen, hideTable, showTable]);

    const clickable = true;

    const { data: session } = useSession();

    const role = session?.user.roleId;
    const isClient = role === RoleType.client;
    const isManager = role === RoleType.manager;
    const isKitchen = role === RoleType.kitchen;
    const isManagerOrKitchen = isManager || isKitchen;

    return (
        <div className='relative'>
            <TableActionConfirm
                dictionary={dictionary}
                getData={getConfirmationData}
            />
            {isClient && <OrderModal
                isOpen={isAddOrderOpen}
                closeModal={addOrderClose}
            />}
            <TableWrapper>
                <TableHeader
                    // search={search}
                    dictionary={dictionary}
                    title={'orders:title'}
                    searchPlaceholder={'orders:search_placeholder'}
                >
                    {isClient ? <MyButton
                        onClick={openOrderModal}
                        icon='fa-solid fa-truck'
                        id={t(dictionary, 'orders:create_order')}
                        ariaLabel={t(dictionary, 'orders:create_order')}
                    // className='items-start sm:items-center'
                    >{t(dictionary, 'orders:create_order')}</MyButton> : null}
                </TableHeader>

                {isTableShown && <QuickFilterRow
                    dictionary={dictionary}
                    // columns={columns}
                    toggleColumn={toggleColumn}
                    checkedColumns={showColumns}
                >
                    <RowActions
                        label={t(dictionary, 'shared:actions')}
                        actions={actions}
                        disabled={!showActions}
                        dictionary={dictionary}
                    />

                    {isManagerOrKitchen && <ClientDropdown
                        dictionary={dictionary}
                        select={chooseClient}
                        selected={clientForFilter}
                    />}
                    {isManagerOrKitchen && <TagSearch
                        updateTagId={updateTagId}
                        dictionary={dictionary}
                    />}
                    <OrderStatusSelect
                        dictionary={dictionary}
                        status={statusForFilter}
                        changeStatus={chooseStatus}
                        omitStatus={isManagerOrKitchen ? OrderStatus.draft : undefined}
                    />
                </QuickFilterRow>}

                {isTableShown && <Table
                    theme={tableTheme}
                    hoverable
                >

                    <TableColumns
                        columns={columns}
                        check={checkAllOnPage}
                        isCheck={isAllChecked}
                        hideCheck={isClient}
                        sortName={sortName}
                        sortDirection={sortDirection}
                        dictionary={dictionary}
                        show={showColumns}
                    />
                    <TableContent
                        tableData={isFetching ? skeleton : table}
                        className="divide-y"
                        key={isFetching ? 'skeleton' : 'table'}
                        show={showColumns}
                        onRowClick={clickable ? onRowClick : undefined}
                        expandedRowId={expandedRowId}
                        ExpandedRow={OrderExpandedRow}
                    />
                </Table>}
                {isTableShown && <TableFooter
                    totalCount={totalCount}
                    pageName={pageName}
                    lang={lang}
                    dictionary={dictionary}
                />}
            </TableWrapper>
            <TableToast
                message={message?.messageObj}
                onClose={message?.resetMessage}
            />
        </div>



    );
}


export default OrdersTable;