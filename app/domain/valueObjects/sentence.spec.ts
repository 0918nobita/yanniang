import { err, ok } from 'neverthrow';
import { expect, test } from 'vitest';

import { Sentence } from './sentence';

test('sentence', () => {
    expect(Sentence.create('')).toEqual(err(['sentence.empty']));

    expect(Sentence.create('我是日本人。')).toEqual(ok('我是日本人。'));

    expect(
        Sentence.create(
            `Lorem ipsum dolor sit amet, \
consectetuer adipiscing elit. \
Aenean commodo ligula eget dolor. \
Aenean massa. Cum sociis natoque penatibus et mag`,
        ),
    ).toEqual(err(['sentence.too_long']));
});
