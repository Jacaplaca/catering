'use client';

import tableTheme from '@root/app/_components/Table/theme';
import MainModal from '@root/app/_components/Modals/MainModal';
import TableColumns from '@root/app/_components/Table/Columns';
import TableContent from '@root/app/_components/Table/Content';
import TableFooter from '@root/app/_components/Table/Footer';
import TableHeader from '@root/app/_components/Table/Header.tsx';
import QuickFilterRow from '@root/app/_components/Table/QuickFilterRow';
import t from '@root/app/lib/lang/translate';
import { useState, type FunctionComponent } from "react";
import RowActions from '@root/app/_components/Table/Actions';
import TableWrapper from '@root/app/_components/Table/Wrapper';
import TableActionConfirm from '@root/app/_components/Table/ActionConfirm';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { Table } from 'flowbite-react';
import TableToast from '@root/app/_components/Table/Toast';
import { useClientFilesTableContext } from '@root/app/specific/components/ClientFiles/context';
import Week from '@root/app/specific/components/ClientFiles/Week';
import Grouper from '@root/app/specific/components/ClientFiles/Grouper';

const clickable = false;

const ClientFilesTable: FunctionComponent = () => {

    const {
        pageName,
        lang,
        dictionary,
        settings,
        data: { table, skeleton },
        columns,
        isFetching,
        totalCount,
        search,
        sort: { sortName, sortDirection },
        action: {
            showActions,
            isAllChecked,
            checkAllOnPage,
            getConfirmationData,
            actions,
            showConfirmation
        },
        // filter: { tags: { updateTagId } },
        message
    } = useClientFilesTableContext();

    // const [isInviteOpen, setInviteOpen] = useState(false);

    // const handleInviteOpen = () => { setInviteOpen(true); }

    return (
        <div className='relative'>
            <TableActionConfirm
                dictionary={dictionary}
                getData={getConfirmationData}
            />
            <Grouper />
            {/* <MainModal
                isOpen={isInviteOpen}
                closeModal={() => setInviteOpen(false)}
                header={t(dictionary, 'invite:title', [settings?.main?.siteName?.toString()])}
            >
            </MainModal> */}
            <TableWrapper>
                <TableHeader
                    search={search}
                    dictionary={dictionary}
                    title={'clients:title'}
                    searchPlaceholder={'clients:search_placeholder'}
                >
                    <Week />
                </TableHeader>
                <QuickFilterRow
                    dictionary={dictionary}
                    columns={columns}
                    childrenClassName='w-full justify-between'
                >
                    <RowActions
                        label={t(dictionary, 'shared:actions')}
                        actions={actions}
                        disabled={!showActions}
                        dictionary={dictionary}
                    />
                    <MyButton
                        id="remove-all-week-files"
                        ariaLabel={t(dictionary, 'client-files:delete_confirmation_all_week_files_button')}
                        onClick={() => showConfirmation('removeAll')}
                        icon='fas fa-trash'
                    >
                        {t(dictionary, 'client-files:delete_confirmation_all_week_files_button')}
                    </MyButton>
                </QuickFilterRow>
                <Table
                    theme={{
                        ...tableTheme,
                        body: { ...tableTheme.body, cell: { ...tableTheme.body.cell, base: `${tableTheme.body.cell?.base} p-0 mx-0` } },
                    }}
                    hoverable
                >
                    <TableColumns
                        columns={columns}
                        check={checkAllOnPage}
                        isCheck={isAllChecked}
                        sortName={sortName}
                        sortDirection={sortDirection}
                        dictionary={dictionary}
                    />
                    <TableContent
                        tableData={isFetching ? skeleton : table}
                        className="divide-y"
                        key={isFetching ? 'skeleton' : 'table'}
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
        </div >
    );
}


export default ClientFilesTable;