import { createContext } from 'react';

import type { Language } from './language';
import { type TranslationKey, tl } from './translations';

type I18nContextType = {
    language: Language;
    t: (key: TranslationKey) => string;
};

export const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
    children,
    language,
}: { children: React.ReactNode; language: Language }) {
    const t = (key: TranslationKey) => tl(language, key);

    return (
        <I18nContext.Provider value={{ language, t }}>
            {children}
        </I18nContext.Provider>
    );
}
