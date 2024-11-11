import "app/styles/main.scss";
import "app/styles/globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "app/trpc/react";
import Providers from 'app/partials/Providers';
import { env } from '@root/app/env';
import Main from '@root/app/_components/Main';
import { LangProvider } from 'app/contexts/LangContext';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: LocaleApp }>;
}) {
  const { children } = props;
  const params = await props.params;
  const lang = params?.lang || env.NEXT_PUBLIC_DEFAULT_LOCALE;

  return (
    <html lang={lang} suppressHydrationWarning={true}>
      <body className={`${inter.variable} min-w-fit scrollbar-thin`}>
        <LangProvider lang={lang}>
          <Providers>
            <TRPCReactProvider>
              <Main lang={lang}>{children}</Main>
            </TRPCReactProvider>
          </Providers>
        </LangProvider>
      </body>
      <GoogleAnalytics gaId={env.GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
