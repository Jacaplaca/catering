const imagePath = '/images/flags/'
const pl = `${imagePath}pl.svg`
// const en = `${imagePath}en.svg`
// const de = `${imagePath}de.svg`

export const i18n = {
  appStructureLocale: 'en',
  // locales: ['pl'],
  locales: ['pl'],
} as const

declare global {
  export type LocaleApp = (typeof i18n)['locales'][number]
}
export type LocaleSrc = typeof i18n['appStructureLocale']
export type Locale = LocaleApp | LocaleSrc




// export type StructureLocale = (typeof i18n)['appStructureLocale']

export const pickerData: { [key in LocaleApp]: {
  icon: string,
  language: string,
  label: {
    [key in LocaleApp]: string
  }
} } = {
  // en: {
  //   icon: en,
  //   label: {
  //     en: 'English',
  //     de: 'Englisch',
  //     pl: 'Angielski',
  //   }
  // },
  // de: {
  //   icon: de,
  //   label: {
  //     en: 'German',
  //     de: 'Deutsch',
  //     pl: 'Niemiecki',
  //   }
  // },
  pl: {
    icon: pl,
    language: 'pl-PL',
    label: {
      // en: 'Polish',
      // de: 'Polnisch',
      pl: 'Polski',
    }
  },
}