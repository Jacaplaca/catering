'use client';

import MainModal from '@root/app/_components/Modals/MainModal';
import TableFooter from '@root/app/_components/Table/Footer';
import TableHeader from '@root/app/_components/Table/Header.tsx';
import QuickFilterRow from '@root/app/_components/Table/QuickFilterRow';
import t from '@root/app/lib/lang/translate';
import { useTableContext } from '@root/app/specific/components/Users/context';
import { useState, type FunctionComponent } from "react";
import RowActions from '@root/app/_components/Table/Actions';
import TableWrapper from '@root/app/_components/Table/Wrapper';
import TableActionConfirm from '@root/app/_components/Table/ActionConfirm';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import { Table } from 'flowbite-react';
import TableColumns from '@root/app/_components/Table/Columns';
import TableContent from '@root/app/_components/Table/Content';
import tableTheme from '@root/app/_components/Table/theme';
import Invite from '@root/app/_components/Dashboard/Settings/Invite';


const UsersTable: FunctionComponent = () => {
    const {
        pageName,
        lang,
        dictionary,
        settings,
        data: { table, skeleton },
        columns: { columns },
        isFetching,
        totalCount,
        search,
        sort: { sortName, sortDirection },
        action: {
            showActions,
            isAllChecked,
            checkAllOnPage,
            getConfirmationData,
            actions
        },
        filter: { roleFilter }
    } = useTableContext();

    const [isInviteOpen, setInviteOpen] = useState(false);

    const handleInviteOpen = () => {
        setInviteOpen(true);
    }

    return (
        <>
            <TableActionConfirm
                dictionary={dictionary}
                getData={getConfirmationData}
            />
            <MainModal
                isOpen={isInviteOpen}
                closeModal={() => setInviteOpen(false)}
                header={t(dictionary, 'invite:title', [settings?.main?.siteName?.toString() ?? ''])}
            >
                <Invite
                    lang={lang}
                    dictionary={dictionary}
                />
            </MainModal>
            <TableWrapper>
                <TableHeader
                    search={search}
                    dictionary={dictionary}
                    title={'users:title'}
                    searchPlaceholder={'users:search_placeholder'}
                ><MyButton
                    onClick={handleInviteOpen}
                    icon='fas fa-user-plus'
                    id={t(dictionary, 'users:add_user')}
                    ariaLabel={t(dictionary, 'users:add_user')}
                >{t(dictionary, 'users:add_user')}</MyButton>
                </TableHeader>
                <QuickFilterRow
                    dictionary={dictionary}
                    label={t(dictionary, 'shared:show_only')}
                    labels={roleFilter}
                >
                    <RowActions
                        label={t(dictionary, 'shared:actions')}
                        actions={actions}
                        disabled={!showActions}
                        dictionary={dictionary}
                    />
                </QuickFilterRow>
                <Table theme={tableTheme} >
                    <TableColumns
                        columns={isFetching ? [] : columns}
                        check={checkAllOnPage}
                        isCheck={isAllChecked}
                        sortName={sortName}
                        sortDirection={sortDirection}
                        show={columns.map(column => column.key)}
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
        </ >
    );
}


export default UsersTable;