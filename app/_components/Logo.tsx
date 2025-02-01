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

  // Calculate proportional dimensions
  const originalWidth = parseInt(width.replace("px", ""));
  const originalHeight = parseInt(height.replace("px", ""));
  const maxHeight = 60;
  const scale = Math.min(maxHeight / originalHeight, 1);
  const scaledWidth = Math.round(originalWidth * scale);
  const scaledHeight = Math.round(originalHeight * scale);

  return (
    <Link href={mainPage} className="navbar-brand inline-block">
      {logoPath ? (
        <Image
          width={scaledWidth * 2}
          height={scaledHeight * 2}
          src={logoPath}
          alt={title}
          priority
          style={{
            height: `${scaledHeight}px`,
            width: `${scaledWidth}px`,
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
