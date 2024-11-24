import { genSalt, hash } from 'bcrypt-ts';
import { err, ok } from 'neverthrow';
import type Rollbar from 'rollbar';
import { D1QB } from 'workers-qb';

import type { IdGenerator, UserRepository } from '~/domain/repositories';

export const createD1UserRepository = (
    d1: D1Database,
    idGenerator: IdGenerator,
    logger: Rollbar,
): UserRepository => {
    const qb = new D1QB(d1);

    return {
        create: async (newUser) => {
            const id = idGenerator.generate();

            let hashedPassword: string;
            try {
                const salt = await genSalt(12);
                hashedPassword = await hash(newUser.password, salt);
            } catch (e) {
                logger.error({
                    message:
                        'ユーザー登録時にパスワードのハッシュ化に失敗しました',
                    cause: e,
                });
                return err('user_repo.create');
            }

            try {
                await qb
                    .insert({
                        tableName: 'users',
                        data: {
                            id,
                            name: newUser.name,
                            password: hashedPassword,
                        },
                    })
                    .execute();
            } catch (e) {
                logger.error({
                    message: 'ユーザー登録時に DB への書き込みに失敗しました',
                    cause: e,
                });

                return err('user_repo.create');
            }

            return ok(void 0);
        },

        findById: (_id) => {
            throw new Error('not implemented');
        },
    };
};
