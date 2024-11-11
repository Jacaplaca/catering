import makeHref from '@root/app/lib/url/makeHref';
import { redirect } from 'next/navigation';

const Page404 = ({ lang }: { lang: LocaleApp }) => {
    const url = makeHref({ lang, page: "404" })
    return redirect(url)
};

export default Page404;