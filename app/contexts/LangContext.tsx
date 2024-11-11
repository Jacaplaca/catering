'use client'

import { createContext, useContext } from 'react';

const LangContext = createContext<LocaleApp | null>(null);

export const LangProvider = ({ children, lang }: { children: React.ReactNode; lang: LocaleApp }) => {
    return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
};

export const useLang = () => {
    const context = useContext(LangContext);
    if (context === null) {
        throw new Error('useLang must be used within a LangProvider');
    }
    return context;
}; 