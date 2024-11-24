import { type Result, err, ok } from 'neverthrow';

export type LangCode = 'ja' | 'zhCN';

export namespace LangCode {
    export type Err = 'invalid_lang_code';

    export const create = (rawLang: string): Result<LangCode, Err> => {
        if (rawLang === ja) {
            return ok(ja);
        }

        if (rawLang === zhCN) {
            return ok(zhCN);
        }

        return err('invalid_lang_code');
    };

    export const ja = 'ja' as LangCode;

    export const zhCN = 'zh-CN' as LangCode;

    export const equals = (a: LangCode, b: LangCode) => a === b;
}
