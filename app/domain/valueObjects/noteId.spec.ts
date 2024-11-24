import { err, ok } from 'neverthrow';
import { expect, test } from 'vitest';

import { NoteId } from './noteId';

test('noteId', () => {
    expect(NoteId.create('')).toEqual(err('invalid_note_id'));

    expect(NoteId.create('foo')).toEqual(err('invalid_note_id'));

    expect(NoteId.create('01936731-1d4c-77a8-847c-079e0fd50ab2')).toEqual(
        ok('01936731-1d4c-77a8-847c-079e0fd50ab2'),
    );
});
