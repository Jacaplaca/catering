import Shoot from '@root/app/[lang]/testing/Shoot';
import makeHref from '@root/app/lib/url/makeHref';
import PageLayout from '@root/app/partials/PageLayout';
import { type NextPage } from 'next';

const pageName = 'testing';

const Testing: NextPage<{
  params: Promise<{
    lang: LocaleApp;
  }>;
}> = async (props) => {
  const params = await props.params;
  const lang = params.lang;

  return (
    <PageLayout
      h1={pageName}
      seoData={{
        title: pageName,
        description: pageName,
        url: makeHref({ lang, page: pageName }, true),
      }}
      lang={lang}
    >
      {/* <Shoot /> */}
      test
    </PageLayout>
  );
};

export default Testing;
