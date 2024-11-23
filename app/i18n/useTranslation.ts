import { useContext } from 'react';

import { I18nContext } from './context';

export const useTranslation = () => {
    const context = useContext(I18nContext);

    if (context === null) {
        throw new Error('useTranslation hook must be used within I18nProvider');
    }

    return context;
};
