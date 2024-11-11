import SignOutComponent from '@root/app/[lang]/(auth)/sign-out/Component';
import { type NextPage } from 'next';

const signOutPage: NextPage<{
  params: Promise<{
    lang: LocaleApp,
  }>;
}> = async (props) => {
  const params = await props.params;
  const lang = params.lang;

  return <SignOutComponent lang={lang} />
};

export default signOutPage;
