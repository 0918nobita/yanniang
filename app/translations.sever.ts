import type { Language } from './language';

export const translations = {
    ja: {
        login: 'ログイン',
        signUp: 'アカウント登録',
    },
    'zh-CN': {
        login: '登录',
        signUp: '注册',
    },
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.ja;
