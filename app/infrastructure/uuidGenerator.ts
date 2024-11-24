import { v7 as uuidV7 } from 'uuid';

import type { IdGenerator } from '~/domain/repositories/idGenerator';

export const uuidGenerator: IdGenerator = {
    generate: () => uuidV7(),
};
