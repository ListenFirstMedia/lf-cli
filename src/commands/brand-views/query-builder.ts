import BaseCommand from '../../base-command';

import { flags } from '@oclif/command';
import * as fs from 'fs';
import { brandViewsQueryBuilder } from '../../query-builders';

export default class QueryBuilder extends BaseCommand {
    static description =
        'Build an Brand Views request through an interactive dialogue';

    static flags = {
        output: flags.string({
            char: 'o',
            description: 'save query to file',
            required: false,
        }),
        ...BaseCommand.flags,
    };

    static examples = [
        '$ lf-cli brand-views:query-builder',
        '$ lf-cli brand-views:query-builder -o my-query.json',
    ];

    async run() {
        const opts = this.parse(QueryBuilder);
        const client = await this.lfapiClient();

        const query = await brandViewsQueryBuilder(client);

        if (opts.flags.output) {
            fs.writeFileSync(opts.flags.output, JSON.stringify(query, null, 2));
            this.log(`Query written to: ${opts.flags.output}`);
        } else {
            this.pp(query);
        }
    }
}
