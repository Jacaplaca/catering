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
import { useKitchensTableContext } from '@root/app/specific/components/Kitchens/context';
import Invite from '@root/app/_components/Dashboard/Settings/Invite';

const clickable = false;

const KitchenTable: FunctionComponent = () => {
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
    } = useKitchensTableContext();

    const [isInviteOpen, setInviteOpen] = useState(false);

    const handleInviteOpen = () => { setInviteOpen(true); }

    return (
        <>
            <TableActionConfirm
                dictionary={dictionary}
                getData={getConfirmationData}
            />
            <MainModal
                isOpen={isInviteOpen}
                closeModal={() => setInviteOpen(false)}
                header={t(dictionary, 'invite:title', [settings?.main?.siteName?.toString()])}
            >
                <Invite
                    lang={lang}
                    dictionary={dictionary}
                    role='kitchen'
                />
            </MainModal>
            <TableWrapper>
                <TableHeader
                    search={search}
                    dictionary={dictionary}
                    title={'kitchens:title'}
                    searchPlaceholder={'kitchens:search_placeholder'}
                ><MyButton
                    onClick={handleInviteOpen}
                    icon='fas fa-user-plus'
                    id={t(dictionary, 'kitchens:add_kitchen')}
                    ariaLabel={t(dictionary, 'kitchens:add_kitchen')}
                >{t(dictionary, 'kitchens:add_kitchen')}</MyButton>
                </TableHeader>
                <QuickFilterRow
                    dictionary={dictionary}
                    columns={columns}
                >
                    <RowActions
                        label={t(dictionary, 'shared:actions')}
                        actions={actions}
                        disabled={!showActions}
                        dictionary={dictionary}
                    />
                </QuickFilterRow>

                <Table
                    theme={tableTheme}
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
        </ >
    );
}


export default KitchenTable;