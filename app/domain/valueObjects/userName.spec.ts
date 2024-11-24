import { err, ok } from 'neverthrow';
import { expect, test } from 'vitest';

import { UserName } from './userName';

test('userName', () => {
    expect(UserName.create('abc低')).toEqual(
        err(['user_name.invalid_char', 'user_name.too_short']),
    );

    expect(UserName.create('abcdefghijklmnopqrstuvwxyz')).toEqual(
        err(['user_name.too_long']),
    );

    expect(UserName.create('abcde')).toEqual(ok('abcde'));
});
