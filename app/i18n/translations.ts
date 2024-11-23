import type { Language } from './language';

export const translations = {
    ja: {
        login: 'ログイン',
        password: 'パスワード',
        signUp: 'アカウント登録',
        userName: 'ユーザー名',
    },
    'zh-CN': {
        login: '登录',
        password: '密码',
        signUp: '注册',
        userName: '用户名',
    },
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.ja;

export const tl = (language: Language, key: TranslationKey) =>
    translations[language][key] ?? key;
