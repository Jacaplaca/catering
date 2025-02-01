import makeHref from '@root/app/lib/url/makeHref';
import AddClientAndPick from '@root/app/specific/components/ui/ClientPicker/AddAndPick';
import { api } from '@root/app/trpc/server';
import { redirect } from 'next/navigation';

const getManagerClientsProfiles = async () => {
    return await api.user.clients()
}

const ClientPickerWrapper = async ({ lang, searchParams, pageName, dictionary }: { lang: LocaleApp, searchParams: Record<string, string>, pageName: string, dictionary: Record<string, string> }) => {
    const clients = await getManagerClientsProfiles();
    const updateClientParams = (clientId: string) => {
        if (searchParams?.clientId === clientId) {
            return;
        }
        redirect(makeHref({ lang, page: pageName, params: new URLSearchParams({ ...searchParams, clientId }) }));
    }
    const clientNoName = clients?.find((client) => !client.name)?.id;
    if (clientNoName) {
        updateClientParams(clientNoName);
    } else if (!searchParams?.clientId && clients?.[0]?.id) {
        updateClientParams(clients[0].id);
    }
    if (!clients || clients?.length === 0) {
        return null;
    }

    return <div className='mb-4'>
        <AddClientAndPick
            clients={clients}
            // updateSearchParams={updateSearchParams}
            searchParams={searchParams}
            pageName={pageName}
            lang={lang}
            dictionary={dictionary}
        />
    </div>
}

export default ClientPickerWrapper;