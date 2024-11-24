import { type Result, ok, err } from 'neverthrow';
import * as uuid from 'uuid';

import type { Brand } from '~/utils/brand';

export type NoteId = string & Brand<'NoteId'>;

export namespace NoteId {
    export type Err = 'invalid_note_id';

    export const create = (rawNoteId: string): Result<NoteId, Err> =>
        uuid.validate(rawNoteId)
            ? ok(rawNoteId as NoteId)
            : err('invalid_note_id');

    export const equals = (a: NoteId, b: NoteId) => a === b;
}
