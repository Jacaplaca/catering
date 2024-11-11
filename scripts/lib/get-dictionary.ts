import { env } from '@root/app/env';
import { i18n, type Locale } from '@root/i18n-config'
import fs from 'fs';
import path from 'path';
const { locales } = i18n

const folderPath = './app/assets/dictionaries';

const dictionaries: Record<Locale, (folder: string) => Record<string, Record<string, string>>> = locales.reduce((acc, locale) => {
  return {
    ...acc,
    [locale]: (folder: string) => {
      const filePath = path.join(process.cwd(), folder, `${locale}.json`);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent) as Record<string, Record<string, string>>;
    }
  }
}, {} as Record<Locale, (folder: string) => Record<string, Record<string, string>>>)

export const getDictionary = (locale: Locale): Record<string, Record<string, string>> => {

  const getFolderNames = (): string[] => {
    const folderNames = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    return folderNames;
  };

  const translations = dictionaries[locale]?.(folderPath) ?? dictionaries[env.NEXT_PUBLIC_DEFAULT_LOCALE](folderPath);

  const folderNames = getFolderNames();
  for (const moduleName of folderNames) {
    const fullPath = `${folderPath}/${moduleName}`;
    const moduleDictionaries = dictionaries[locale]?.(fullPath) ?? dictionaries[env.NEXT_PUBLIC_DEFAULT_LOCALE](fullPath);
    Object.keys(moduleDictionaries).forEach((key) => {
      if (translations[key]) {
        translations[key] = { ...translations[key], ...moduleDictionaries[key] };
      }
      else {
        Object.assign(translations, { [key]: moduleDictionaries[key] });
      }
    });

  }
  return translations;
}