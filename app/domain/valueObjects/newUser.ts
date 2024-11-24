import type { UserName } from './userName';

export type NewUser = Readonly<{
    name: UserName;
    password: string;
}>;
