import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import DocumentsComponent from '@root/app/specific/components/Documents/DocumentsComponent';
import { api } from '@root/app/trpc/server';
import { type FunctionComponent } from 'react';

const Documents: FunctionComponent<{
    lang: LocaleApp,
    pageName: string
}> = async ({ lang }) => {
    const clientFiles = await api.specific.clientFiles.asClient();
    const [
        dictionary,
    ] = await Promise.all([
        getDictFromApi(lang, ["shared", "documents"]),
    ])

    return (
        <DocumentsComponent clientFiles={clientFiles} dictionary={dictionary} />
    )
}

export default Documents;