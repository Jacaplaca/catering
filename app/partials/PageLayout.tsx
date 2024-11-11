import SignInView from '@root/app/_components/SignInView';
import { env } from '@root/app/env';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import PageHeader from '@root/app/partials/PageHeader';
import SeoMeta from '@root/app/partials/SeoMeta';
import { HydrateClient } from '@root/app/trpc/server';
import type { FC, ReactNode } from 'react';
import { auth } from '@root/app/server/auth';
interface AuthLayoutProps {
    children: ReactNode;
    h1?: string;
    showBreadcrumb?: boolean;
    seoData: {
        title: string,
        description: string,
        image?: string | null,
        url: string
        ogType?: 'website' | 'article'
    },
    schemaData?: Record<string, unknown>
    schemaBreadcrumb?: Record<string, unknown>
    isLogged?: boolean
    lang: LocaleApp,
    fullPage?: boolean
}

const PageLayout: FC<AuthLayoutProps> = async ({ children, h1, showBreadcrumb, seoData, schemaData, schemaBreadcrumb, isLogged, lang, fullPage }) => {
    const { title, description, image = "", url, ogType = 'website' } = seoData
    const settings = await getSettingsFromApi('main') as unknown as { "siteName": string };
    const session = await auth();
    const allow = isLogged ? !!session : true;
    const schema = {
        "@context": "http://schema.org",
        "@type": "WebPage",
        "url": url,
        "description": description,
        "image": image
    }
    const baseUrl = env.DOMAIN;
    return <HydrateClient>
        <div className={`flex flex-col w-full ${fullPage ? "" : 'mb-20'}`}>
            <SeoMeta
                meta_title={title}
                description={description}
                schema={schemaData ?? schema}
                image={image}
                schemaBreadcrumb={schemaBreadcrumb}
                ogType={ogType}
                siteName={settings.siteName}
                baseUrl={baseUrl}
            />
            <div className={`flex flex-col  w-full mx-auto ${fullPage ? "" : "max-w-7xl container"} text-left flex-1`}>
                {fullPage ? "" : <div className='py-14'>
                    {h1 ? <PageHeader title={h1 || ""} showBreadcrumb={showBreadcrumb} /> : null}
                </div>}
                <div className='flex flex-col flex-1 items-center justify-center'>
                    {allow ? children : <SignInView
                        lang={lang}
                        redirectUrl={url}
                    />}
                </div>
            </div>
        </div>
    </HydrateClient>
};

export default PageLayout;