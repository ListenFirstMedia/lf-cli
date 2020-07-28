import { flags } from '@oclif/command';

export const pagingFlags = {
    'per-page': flags.integer({
        description: 'number of results per page',
    }),
    page: flags.integer({
        description: 'starting page number',
        default: 1,
    }),
    'max-page': flags.integer({
        description: 'the max page number to fetch (-1 for all pages)',
        default: 1,
    }),
};
