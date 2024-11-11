"use client";

import { usePathname } from "next/navigation";
import { plainify, removeTrailingSlash } from '@root/app/lib/textConverter';
import theme from '@root/config/theme';
import { favicon, metadata } from '@root/config/config';
const pf = theme.fonts.font_family.primary;
const sf = theme.fonts.font_family.secondary;
// const code = theme.fonts.font_family.code;


const SeoMeta = ({
  title,
  meta_title,
  image,
  description,
  schema,
  schemaBreadcrumb,
  ogType = 'website',
  siteName = "",
  baseUrl = ''
}: {
  title?: string;
  meta_title?: string;
  image?: string | null;
  description?: string;
  canonical?: string;
  schema?: Record<string, unknown>;
  schemaBreadcrumb?: Record<string, unknown>;
  ogType?: 'website' | 'article';
  siteName?: string;
  baseUrl?: string;
}) => {
  // const baseUrl = env.DOMAIN;
  const pathname = usePathname() || "";
  let fullCanonical = `${baseUrl}/${pathname.replace("/", "")}`
  fullCanonical = removeTrailingSlash(fullCanonical);


  return (
    <>
      {/* First, character encoding and viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Page title */}
      <title>{plainify(meta_title ? meta_title : title ? title : "")}</title>

      {/* Meta tags for SEO and page information */}
      <meta name="description" content={plainify(description ? description : metadata.meta_description)} />
      {/* Schema.org scripts right after the description */}
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      {schemaBreadcrumb && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />}
      {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} /> */}
      <meta name="author" content={metadata.meta_author} />
      <meta name="robots" content="noindex,nofollow" />

      {/* Open Graph / Social Media Tags */}
      <meta property="og:title" content={plainify(meta_title ? meta_title : title ? title : "")} />
      <meta property="og:description" content={plainify(description ? description : metadata.meta_description)} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={`${baseUrl}/${pathname.replace("/", "")}`} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={`${baseUrl}${image ? image : metadata.meta_image}`} />

      {/* Additional meta tags specific to platforms */}
      <meta name="theme-name" content="nextplate" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />

      {/* Icons and favicons */}
      <link rel="apple-touch-icon" sizes="180x180" href={favicon[180]} />
      <link rel="icon" type="image/png" sizes="16x16" href={favicon[16]} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon[32]} />
      <link rel="mask-icon" href={favicon.SVG} color="#FFFFFF" />

      {/* Preconnect to external resources (e.g., fonts) */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={`https://fonts.googleapis.com/css2?family=${pf}${sf ? "&family=" + sf : ""}&display=swap`} rel="stylesheet" />
      {/* <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&display=swap" rel="stylesheet" /> */}
      <link rel="canonical" href={fullCanonical} itemProp="url" />
    </>
  );
};

export default SeoMeta;
