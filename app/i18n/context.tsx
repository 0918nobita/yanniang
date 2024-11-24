import { createContext } from 'react';

import type { LangCode } from '~/domain/valueObjects';

import { type TranslationKey, tl } from './translations';

type I18nContextType = {
    language: LangCode;
    t: (key: TranslationKey) => string;
};

export const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
    children,
    language,
}: { children: React.ReactNode; language: LangCode }) {
    const t = (key: TranslationKey) => tl(language, key);

    return (
        <I18nContext.Provider value={{ language, t }}>
            {children}
        </I18nContext.Provider>
    );
}
