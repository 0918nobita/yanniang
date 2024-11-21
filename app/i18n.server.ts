import { createCookie } from 'react-router';

import type { Language } from './language';

export const languageCookie = createCookie('user-language', {
    maxAge: 31536000,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
});

function resolveLanguage(acceptLanguage: string): Language {
    const langPriority = acceptLanguage
        .split(',')
        .map((item) => item.split(';')[0].trim());

    const jaIndex = langPriority.findIndex((item) => item === 'ja');
    const zhCnIndex = langPriority.findIndex((item) => item === 'zh-CN');

    return jaIndex < zhCnIndex ? 'ja' : 'zh-CN';
}

export async function getLanguage(request: Request): Promise<Language> {
    // TODO: ログイン済みの場合、ユーザー設定を参照する

    const cookieLang = await languageCookie.parse(
        request.headers.get('Cookie'),
    );

    if (cookieLang === 'ja' || cookieLang === 'zh-CN') {
        return cookieLang;
    }

    const acceptLanguage = request.headers.get('Accept-Language');

    if (acceptLanguage !== null) {
        return resolveLanguage(acceptLanguage);
    }

    return 'ja';
}
