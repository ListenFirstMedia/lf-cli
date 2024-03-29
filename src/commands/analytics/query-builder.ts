import BaseCommand from '../../base-command';

import { Flags as flags } from '@oclif/core';
import * as fs from 'node:fs';
import { analyticsQueryBuilder } from '../../query-builders';

export default class QueryBuilder extends BaseCommand {
    static description =
        'Build an analytics query through an interactive dialogue';

    static flags = {
        output: flags.string({
            char: 'o',
            description: 'save query to file',
            required: false,
        }),
        ...BaseCommand.flags,
    };

    static examples = [
        '$ lf-cli analytics:query-builder',
        '$ lf-cli analytics:query-builder -o my-query.json',
    ];

    async run() {
        const opts = await this.parse(QueryBuilder);
        const client = await this.lfapiClient();

        const query = await analyticsQueryBuilder(client);

        if (opts.flags.output) {
            fs.writeFileSync(opts.flags.output, JSON.stringify(query, null, 2));
            this.log(`Query written to: ${opts.flags.output}`);
        } else {
            this.pp(query);
        }
    }
}
