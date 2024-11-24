import type { Result } from 'neverthrow';

import type { NewUser } from '../valueObjects';

export type RegisterUserError = 'register_user';

export interface RegisterUser {
    execute: (newUser: NewUser) => Promise<Result<void, RegisterUserError>>;
}
