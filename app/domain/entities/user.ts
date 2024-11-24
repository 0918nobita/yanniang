import type { UserId, UserName } from '~/domain/valueObjects';

export type User = Readonly<{
    id: UserId;
    name: UserName;
    isDeleted: boolean;
}>;

export namespace User {
    export const create = ({
        id,
        name,
        isDeleted = false,
    }: { id: UserId; name: UserName; isDeleted?: boolean }): User => {
        return { id, name, isDeleted };
    };

    export const deleteUser = (user: User): User => ({
        ...user,
        isDeleted: true,
    });

    export const equals = (a: User, b: User) => a.id === b.id;
}
