import { type Result, err, ok } from 'neverthrow';

import type { LangCode, NoteId, Sentence, UserId } from '~/domain/valueObjects';
import type { NonEmptyArray } from '~/utils/nonEmptyArray';

type ExampleSentences = NonEmptyArray<
    [Sentence, NonEmptyArray<[LangCode, Sentence]>]
>;

export type Word = Readonly<{
    id: NoteId;
    author: UserId;
    mainLang: LangCode;
    title: string;
    descriptions: NonEmptyArray<[LangCode, string]>;
    exampleSentences: ExampleSentences | null;
    isDeleted: boolean;
}>;

export type WordError = 'word.empty_title' | 'word.title_too_long';

export namespace Word {
    export const create = ({
        id,
        author,
        mainLang,
        title,
        descriptions,
        exampleSentences = null,
        isDeleted = false,
    }: {
        id: NoteId;
        author: UserId;
        title: string;
        mainLang: LangCode;
        descriptions: NonEmptyArray<[LangCode, string]>;
        exampleSentences?: ExampleSentences | null;
        isDeleted?: boolean;
    }): Result<Word, WordError> => {
        const len = Array.from(title).length;

        if (len === 0) {
            return err('word.empty_title');
        }

        if (len > 20) {
            return err('word.title_too_long');
        }

        return ok({
            id,
            author,
            mainLang,
            title,
            descriptions,
            exampleSentences,
            isDeleted,
        });
    };

    export const deleteWord = (word: Word): Word => ({
        ...word,
        isDeleted: true,
    });

    export const equals = (a: Word, b: Word) => a.id === b.id;
}
