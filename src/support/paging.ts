import { Flags as flags } from '@oclif/core';

export const pagingFlags = {
    'per-page': flags.integer({
        description: 'number of results per page',
    }),
    page: flags.integer({
        description: 'starting page number',
    }),
    'max-page': flags.integer({
        description: 'the max page number to fetch (-1 for all pages)',
        default: 1,
    }),
};
