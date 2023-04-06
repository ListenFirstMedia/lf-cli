import BaseCommand from '../../base-command';

import { flags } from '@oclif/command';
import * as fs from 'node:fs';
import { brandViewsQueryBuilder } from '../../query-builders';
import { join as _join } from 'lodash';
import * as querystring from 'node:querystring';

export default class RequestBuilder extends BaseCommand {
    static description =
        'Build an Brand Views request through an interactive dialogue';

    static flags = {
        output: flags.string({
            char: 'o',
            description: 'save query to file',
            required: false,
        }),
        'show-curl': flags.boolean({
            description: 'print request as curl command',
            required: false,
        }),
        ...BaseCommand.flags,
    };

    static examples = [
        '$ lf-cli brand-views:request-builder',
        '$ lf-cli brand-views:request-builder -o my-query.json',
        '$ lf-cli brand-views:request-builder --show-curl',
    ];

    async run() {
        const opts = this.parse(RequestBuilder);
        const client = await this.lfapiClient();

        const query = await brandViewsQueryBuilder(client);

        if (opts.flags['show-curl']) {
            const queryArgs: any = {};

            if (query.filters && query.filters.length > 0) {
                queryArgs.filters = JSON.stringify(query.filters);
            }

            if (query.fields && query.fields.length > 0) {
                queryArgs.fields = _join(query.fields, ',');
            }

            if (query.sort && query.sort.length > 0) {
                queryArgs.sort = JSON.stringify(query.sort);
            }

            if (query.per_page && query.per_page > 0) {
                queryArgs.per_page = query.per_page;
            }

            const queryStr = querystring.stringify(queryArgs);
            const path = `/v20200626/brand_views?${queryStr}`;
            const curl = await client.asCurl(path);
            this.log(curl);
        } else if (opts.flags.output) {
            fs.writeFileSync(opts.flags.output, JSON.stringify(query, null, 2));
            this.log(`Query written to: ${opts.flags.output}`);
        } else {
            this.pp(query);
        }
    }
}
