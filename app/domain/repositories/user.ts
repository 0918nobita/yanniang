import type { Result } from 'neverthrow';

import type { User } from '~/domain/entities';
import type { NewUser, UserId } from '~/domain/valueObjects';

export type UserRepoCreateError = 'user_repo.create';

export interface UserRepository {
    create: (newUser: NewUser) => Promise<Result<void, UserRepoCreateError>>;

    findById: (id: UserId) => Promise<User | null>;
}
