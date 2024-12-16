import type { Result } from 'neverthrow';

import type { Password, UserId, UserName } from '../valueObjects';

export interface SignUpUseCase {
    signUp(
        userId: UserId,
        userName: UserName,
        password: Password,
    ): Promise<Result<void, unknown>>;
}
