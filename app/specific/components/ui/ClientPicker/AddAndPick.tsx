'use client'

import { type Client } from '@prisma/client';
import { useState, type FunctionComponent } from 'react';
import { api } from '@root/app/trpc/react';
import makeHref from '@root/app/lib/url/makeHref';
import { useRouter } from 'next/navigation';
import Dropdown from '@root/app/_components/ui/Inputs/Dropdown';
import translate from '@root/app/lib/lang/translate';
import MyButton from '@root/app/_components/ui/buttons/MyButton';
import ConfirmationModal from '@root/app/_components/Modals/Confirmation';

const AddClientAndPick: FunctionComponent<{
    clients: Client[],
    searchParams: Record<string, string>,
    pageName: string,
    lang: LocaleApp,
    dictionary: Record<string, string>
}> = ({ clients, searchParams, pageName, lang, dictionary }) => {
    const router = useRouter();
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    const changeClient = (clientId?: string) => {
        delete searchParams.clientId;
        const newSearchParams = new URLSearchParams({ ...searchParams });
        if (clientId) {
            newSearchParams.set('clientId', clientId);
        }
        router.push(makeHref({ lang, page: pageName, params: newSearchParams }));
    }

    const addClient = api.specific.client.addClient.useMutation({
        onSuccess: (data) => {
            if (data) {
                changeClient(data.id);
            }
        },
    });
    const handleAddClient = () => {
        addClient.mutate();
    }

    const deactivatePlace = api.specific.client.removeClient.useMutation({
        onSuccess: () => {
            changeClient();
        }
    });

    const handleDeactivatePlace = () => {
        if (searchParams?.clientId) {
            deactivatePlace.mutate({ ids: [searchParams.clientId] });
        }
    };

    const hasNoName = clients?.some((client) => !client.name)

    const RemoveButton = () => {
        return (
            <div>
                <ConfirmationModal
                    question={translate(dictionary, 'dashboard:remove-place-confirmation')}
                    isModalOpen={isConfirmationOpen}
                    hide={() => setIsConfirmationOpen(false)}
                    confirmAction={handleDeactivatePlace}
                    dictionary={dictionary}
                />
                <MyButton
                    id='deactivate-place'
                    ariaLabel='Deactivate place'
                    onClick={() => {
                        setIsConfirmationOpen(true);
                    }}
                    className='flex flex-col sm:flex-row gap-1 sm:gap-2'
                >
                    <i className='fa-solid fa-trash' />
                    <span className='text-sm'>{translate(dictionary, 'dashboard:remove-place')}</span>
                </MyButton>
            </div>
        )
    }

    if (hasNoName) {
        return (
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 items-center'>
                <RemoveButton />
                <div>
                    {translate(dictionary, 'dashboard:client-no-name')}
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
            {clients.length > 1 && <RemoveButton />}
            {clients.length > 0 && (
                <div className='w-full sm:w-72'>
                    <Dropdown
                        onChange={changeClient}
                        options={clients.map((client) => ({
                            label: client.name ?? translate(dictionary, 'dashboard:client-no-name'),
                            value: client.id
                        }))}
                        value={searchParams?.clientId ?? ''}
                        styles={{
                            control: {
                                width: 'auto',
                            }
                        }}
                    />
                </div>
            )}
            <MyButton
                id='add-client'
                ariaLabel='add-client'
                onClick={() => setIsConfirmationOpen(true)}
                className='flex flex-col sm:flex-row gap-2'
            >
                <div className='hidden sm:flex gap-2'>
                    <i className='fa-solid fa-plus' />
                    <i className='fa-solid fa-building' />
                </div>
                <span className='text-sm'>{translate(dictionary, 'dashboard:add-new-client')}</span>
            </MyButton>
            <ConfirmationModal
                question={translate(dictionary, 'dashboard:add-new-client-confirmation')}
                isModalOpen={isConfirmationOpen}
                hide={() => setIsConfirmationOpen(false)}
                confirmAction={handleAddClient}
                dictionary={dictionary}
            />
        </div>
    )
}

export default AddClientAndPick;