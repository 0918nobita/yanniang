import { LangCode } from '~/domain/valueObjects';

export const translations = {
    [LangCode.ja]: {
        login: 'ログイン',
        password: 'パスワード',
        signUp: 'アカウント登録',
        userName: 'ユーザー名',
        'userName.invalid':
            'ユーザー名が正しくありません。5文字以上15文字以下で、半角英数字またはアンダーバーを用いて入力してください',
    },
    [LangCode.zhCN]: {
        login: '登录',
        password: '密码',
        signUp: '注册',
        userName: '用户名',
        'userName.invalid':
            '用户名格式不正确。请输入5至15个字符，仅可以使用英文字母、数字或下划线。',
    },
} as const satisfies Record<LangCode, Record<string, string>>;

export type TranslationKey = keyof typeof translations.ja;

export const tl = (language: LangCode, key: TranslationKey) =>
    translations[language][key] ?? key;
