import { type NextPage } from 'next';
import PageLayout from '@root/app/partials/PageLayout';
import { type HomeCustomPageInterface } from '@root/types/pages/home';
import { type Page } from '@prisma/client';
import { env } from '@root/app/env';
import getSettingsFromApi from '@root/app/lib/settings/getSettingsFromApi';
import MDXContent from '@root/app/_components/MDXContent';
import { breadcrumbGen } from '@root/app/lib/schemaGen';
import { getContentFromApi } from '@root/app/lib/getContentFromApi';
import makeHref from '@root/app/lib/url/makeHref';

export const revalidate = 0
const pageName = "home"

const Home: NextPage<{
  params: Promise<{
    lang: LocaleApp
  }>;
}> = async (props) => {
  const params = await props.params;
  const lang = params.lang;

  const page = await getContentFromApi({ lang, key: pageName, contentType: 'page' });
  const { title, description, content } = page as Page & { customData: HomeCustomPageInterface };
  const settings = await getSettingsFromApi("main");

  const url = makeHref({ lang, page: "" }, true);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "brand": settings.siteName,
    "url": url,
    "name": settings.siteName,
    "logo": `${env.DOMAIN}${settings.logo as string}`,
  }

  const schemaBreadcrumb = breadcrumbGen({ title, lang, page: "" });

  const contentBefore = content[0];
  const contentAfter = content[1];

  return (
    <PageLayout
      seoData={{
        title,
        description,
        url,
      }}
      schemaData={schema}
      schemaBreadcrumb={schemaBreadcrumb}
      lang={lang}
    >
      <section className="section pt-7">
        <div className="container">
          <div className="row justify-center">
            <article className="lg:col-10">
              <MDXContent content={contentBefore} className='home' />
            </article>
          </div>
        </div>
        <div className="container">
          <div className="row justify-center">
            <article className="lg:col-10">
              <MDXContent content={contentAfter} className='home' />
            </article>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

export default Home;