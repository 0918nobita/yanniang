import { type Result, err, ok } from 'neverthrow';

import type { Brand } from '~/utils/brand';

export type Sentence = string & Brand<'sentence'>;

export namespace Sentence {
    export type Err = 'sentence.empty' | 'sentence.too_long';

    export const create = (rawSentence: string): Result<Sentence, Err> => {
        if (rawSentence.length < 1) {
            return err('sentence.empty');
        }

        if (rawSentence.length > 140) {
            return err('sentence.too_long');
        }

        return ok(rawSentence as Sentence);
    };

    export const equals = (a: Sentence, b: Sentence) => a === b;
}
