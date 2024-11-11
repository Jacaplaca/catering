import TwSizeIndicator from '@root/app/_components/TwSizeIndicator';
import Header from '@root/app/partials/Header';
import Footer from '@root/app/partials/Footer';
import getPersonalization from '@root/app/lib/settings/getPersonalization';
import SignOutComponent from '@root/app/[lang]/(auth)/sign-out/Component';

const Main: React.FC<{ children: React.ReactNode, lang: LocaleApp }> = async ({ children, lang }) => {
    const personalization = await getPersonalization();

    if (personalization === null) {
        return <SignOutComponent lang={lang} />
    }

    return (
        <>
            <Header
                lang={lang}
                personalization={personalization}
            />
            <TwSizeIndicator />
            <div id="modal-root" className='absolute z-50' ></div>
            <main className='flex flex-1 '>{children}</main>
            <Footer
                lang={lang}
                personalization={personalization}
            />
        </>
    )
}

export default Main;