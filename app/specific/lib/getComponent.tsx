import Users from '@root/app/specific/components/Users'
import translate from '@root/app/lib/lang/translate'
import Settings from '@root/app/specific/components/Settings'
import Clients from '@root/app/specific/components/Clients'
import Dieticians from '@root/app/specific/components/Dieticians'
import Kitchens from '@root/app/specific/components/Kitchens'
import Consumers from '@root/app/specific/components/Consumers'
import Orders from '@root/app/specific/components/Orders'
import ClientFiles from '@root/app/specific/components/ClientFiles'
import Documents from '@root/app/specific/components/Documents'

const getComponent = ({
    key,
    lang,
    dictionary,
    // searchParams,
}: {
    key: string
    lang: LocaleApp
    dictionary: Record<string, string>
    searchParams: Record<string, string>,
}) => {
    const pageName = 'dashboard';
    const components = {
        'accounts': {
            title: translate(dictionary, 'dashboard:item-users-title'),
            component: <Users lang={lang} pageName={pageName} />,
        },
        'settings': {
            title: translate(dictionary, 'dashboard:item-settings-title'),
            component: <Settings lang={lang} pageName={pageName} dictionary={dictionary} />,
        },
        'clients': {
            title: translate(dictionary, 'dashboard:item-clients-title'),
            component: <Clients lang={lang} pageName={pageName} />,
        },
        'dieticians': {
            title: translate(dictionary, 'dashboard:item-dieticians-title'),
            component: <Dieticians lang={lang} pageName={pageName} />,
        },
        'kitchens': {
            title: translate(dictionary, 'dashboard:item-kitchens-title'),
            component: <Kitchens lang={lang} pageName={pageName} />,
        },
        'consumers': {
            title: translate(dictionary, 'dashboard:item-consumers-title'),
            component: <Consumers lang={lang} pageName={pageName} />,
        },
        'orders': {
            title: translate(dictionary, 'dashboard:item-orders-title'),
            component: <Orders lang={lang} pageName={pageName} />,
        },
        'client-files': {
            title: translate(dictionary, 'dashboard:item-client-files-title'),
            component: <ClientFiles lang={lang} pageName={pageName} />,
        },
        'documents': {
            title: translate(dictionary, 'dashboard:item-documents-title'),
            component: <Documents lang={lang} pageName={pageName} />,
        },
    } as Record<string, { title: string, component: JSX.Element }>

    return { ...components[key] };
}

export default getComponent;