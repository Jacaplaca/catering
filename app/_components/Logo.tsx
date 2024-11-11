"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { type FunctionComponent, useEffect, useState } from "react";
import { logo } from '@root/config/config';
import { env } from '@root/app/env';
import getMainPageUrl from '@root/app/lib/url/getMainPageUrl';

const Logo: FunctionComponent<{
  lang: LocaleApp;
  logoDark: string;
  logoLight: string;
}> = ({ lang = env.DEFAULT_LOCALE, logoDark, logoLight }) => {

  const {
    // darkmode,
    width,
    height,
    text,
    title,
    // url
  } = logo;

  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const resolvedLogo =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? `/file/${logoDark}`
      : `/file/${logoLight}`;
  const logoPath = resolvedLogo;

  const mainPage = getMainPageUrl(lang);

  return (
    <Link href={mainPage} className="navbar-brand inline-block">
      {logoPath ? (
        <Image
          width={parseInt(width.replace("px", "")) * 2}
          height={parseInt(height.replace("px", "")) * 2}
          src={logoPath}
          alt={title}
          priority
          style={{
            height: height.replace("px", "") + "px",
            width: width.replace("px", "") + "px",
          }}
        />
      ) : text ? (
        text
      ) : (
        title
      )}
    </Link>
  );
};

export default Logo;
