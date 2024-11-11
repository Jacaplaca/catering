// "use client";

import Link from "next/link";
import { api } from "app/trpc/server";
import { type FunctionComponent } from "react";
import Logo from '@root/app/_components/Logo';
import getDictFromApi from '@root/app/lib/lang/getDictFromApi';
import { copyright } from '@root/config/config';
import translate from '@root/app/lib/lang/translate';


const Links: FunctionComponent<{
  section: { label: string, links: { url: string, id: string, label: string }[] };
  lang: LocaleApp;
}> = ({ section }) => {
  const { label, links } = section;
  return (
    <div className='flex flex-col items-start'>
      <h4 className="mb-2 uppercase text-base font-bold">{label}</h4>
      <ul className='flex flex-col items-start'>
        {links.map((item) => {
          const { url, id, label } = item;
          return (
            <li className="inline-block text-sm" key={id}>
              <Link href={url}>{label}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const getFooter = async (lang: LocaleApp) => await api.navigation.getFooter({ lang });

const Footer: FunctionComponent<{
  lang: LocaleApp;
  personalization: {
    logoDark: string;
    logoLight: string;
  }
}> = async ({ lang, personalization }) => {
  const footer = await getFooter(lang);
  const dictionary = await getDictFromApi(lang, 'Footer')
  return (
    <footer className="bg-gray-100 dark:bg-darkmode-theme-light">
      <div className="container flex flex-col-reverse sm:flex-row justify-around items-center py-10 gap-6">
        <div>
          <Logo
            lang={lang}
            logoDark={personalization.logoDark}
            logoLight={personalization.logoLight}
          />
          {/* <Social source={social} className="social-icons" /> */}
        </div>
        <div className='flex flex-row gap-[60px]'>
          <Links section={footer.company} lang={lang} />
          {footer.content && <Links section={footer.content} lang={lang} />}
        </div>
      </div>
      <div className="border-t border-border py-7 dark:border-darkmode-border">
        <div className="container text-center text-light dark:text-darkmode-light">
          <p
            className="text-sm flex gap-1 justify-center items-center"
          >{translate(dictionary, "Footer:copyright_text")}<strong><Link href={copyright.link}>{copyright.label}</Link></strong>
            {/* <i className='text-xs ml-2'>{env.APP_VERSION}</i> */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
