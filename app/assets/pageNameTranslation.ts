import { type Locale } from '@root/i18n-config'

const defaultPages = {
    signUp: "sign-up",
    signIn: "sign-in",
    signOut: "sign-out",
    resetPassword: "reset-password",
    changePassword: "change-password",
    changeEmail: "change-email",
    "privacy-policy": "privacy-policy",
    "terms-of-service": "terms-of-service",
    profile: "profile",
    about: "about",
    contact: "contact",
    sitemap: "sitemap",
    activate: "activate",
    invitation: "invitation",
    dashboard: "dashboard",
}

const pageNameTrans = {
    en: {
        "sign-up": defaultPages.signUp,
        "sign-in": defaultPages.signIn,
        "sign-out": defaultPages.signOut,
        "reset-password": defaultPages.resetPassword,
        "change-password": defaultPages.changePassword,
        "change-email": defaultPages.changeEmail,
        "privacy-policy": defaultPages['privacy-policy'],
        "terms-of-service": defaultPages['terms-of-service'],
        profile: defaultPages.profile,
        about: defaultPages.about,
        contact: defaultPages.contact,
        sitemap: defaultPages.sitemap,
        activate: defaultPages.activate,
        invitation: defaultPages.invitation,
        dashboard: defaultPages.dashboard,
    },
    pl: {
        logowanie: defaultPages.signIn,
        rejestracja: defaultPages.signUp,
        wylogowanie: defaultPages.signOut,
        "reset-hasla": defaultPages.resetPassword,
        "zmiana-hasla": defaultPages.changePassword,
        "zmiana-email": defaultPages.changeEmail,
        "polityka-prywatnosci": defaultPages['privacy-policy'],
        "warunki-korzystania": defaultPages['terms-of-service'],
        profil: defaultPages.profile,
        "o-nas": defaultPages.about,
        kontakt: defaultPages.contact,
        "mapa-strony": defaultPages.sitemap,
        aktywacja: defaultPages.activate,
        zaproszenie: defaultPages.invitation,
        panel: defaultPages.dashboard,
    },
} as { [key in Locale]: Record<string, string> }

export default pageNameTrans