import type { Result } from 'neverthrow';

import type { Password, UserId } from '../valueObjects';

export interface LoginUseCase {
    login(username: UserId, password: Password): Promise<Result<void, unknown>>;
}
