import { err, ok } from 'neverthrow';
import type Rollbar from 'rollbar';

import type { UserRepository } from '~/domain/repositories';
import type { RegisterUser } from '~/domain/useCases';

export const createRegisterUserUseCase = (
    userRepository: UserRepository,
    logger: Rollbar,
): RegisterUser => {
    return {
        execute: async (newUser) => {
            const result = await userRepository.create(newUser);

            if (result.isErr()) {
                logger.error('RegisterUser UseCase の実行に失敗しました');
                return err('register_user');
            }

            return ok(void 0);
        },
    };
};
