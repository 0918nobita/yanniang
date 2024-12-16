import type { UserId, UserName } from '../valueObjects';

export type User = Readonly<{
    id: UserId;
    userName: UserName;
}>;

export namespace User {
    export const create = (id: UserId, name: UserName) => ({ id, name });

    export const equals = (a: User, b: User) => a.id === b.id;
}
