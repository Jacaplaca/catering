import makeHref from '@root/app/lib/url/makeHref';
import { useRouter, useSearchParams } from 'next/navigation';

const useParam = ({ lang, pageName }
    : { lang: LocaleApp, pageName: string, }) => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const router = useRouter();

    const setParam = ({
        param,
        slugs,
        withDomain
    }: {
        param: [string, string | number]
        slugs: string[]
        withDomain: boolean
    }) => {
        const [key, value] = param;
        params.set(key, value.toString());
        router.push(makeHref({ lang, page: pageName, slugs, params }, withDomain));
    }

    return setParam;
}

export default useParam;
