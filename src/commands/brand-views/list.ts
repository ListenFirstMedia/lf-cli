import ApiCommand from '../../api-command';
import * as querystring from 'node:querystring';
import {
    parseBrandViewFieldsFlag,
    brandViewFlags,
    brandViewColumns,
} from '../../support/brand-view-commands';
import { pagingFlags } from '../../support/paging';
import { parseStdin } from '../../utils';
import { join as _join, concat as _concat } from 'lodash';
import * as fs from 'node:fs';

interface ParamsObject {
    fields?: string[];
    filters?: Array<any>;
    sort?: Array<any>;
    per_page?: number;
}

export default class BrandViewsList extends ApiCommand {
    static description = `List Brand Views

Returns an array of all Brand Views available to the ListenFirst 
Account associated with the access token. Results may be filtered 
and sorted by Brand Metadata Dimensions.`;

    static flags = {
        ...brandViewFlags,
        ...pagingFlags,
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'params_file',
            description:
                'a file containing optional filter, field, and sort parameters',
            required: false,
            default: '-',
        },
    ];

    static examples = [
        '$ lf-cli brand-views:list --pretty my-params.json',
        '$ lf-cli brand-views:generate | lf-cli brand-views:list --format table --max-page -1 --per-page 1000',
        '$ cat my-params.json | lf-cli brand-views:list --format table --max-page -1 --no-header --csv',
        '$ cat my-params.json | lf-cli brand-views:list --format doc --max-page -1 --per-page 1000 > results.jsonl',
        '$ lf-cli brand-views:list --pretty --fields lfm.brand.primary_genre,lfm.brand.programmers my-other-params.json',
        '$ cat my-params.json | lf-cli brand-views:list --show-curl',
        '$ cat my-params.json | lf-cli brand-views:list --show-curl | sh',
    ];

    async run() {
        const opts = this.parse(BrandViewsList);
        const queryArgs: { [index: string]: any } = {
            per_page: 1000,
            page: opts.flags.page,
        };
        if (opts.flags['per-page']) {
            queryArgs.per_page = Number(opts.flags['per-page']);
        }

        const pf = parseBrandViewFieldsFlag(opts.flags.fields);

        if (pf.fields.length > 0) {
            queryArgs.fields = opts.flags.fields;
        }

        if (opts.args.params_file === 'help') {
            await BrandViewsList.run(['-h']);
            this.exit(0);
        }

        let optionalParams: ParamsObject = {};
        if (opts.args.params_file === '-' && !process.stdin.isTTY) {
            optionalParams = await parseStdin();
        } else if (fs.existsSync(opts.args.query_file)) {
            optionalParams = JSON.parse(
                fs.readFileSync(opts.args.query_file, 'utf-8')
            );
        }

        if (optionalParams.filters) {
            queryArgs.filters = JSON.stringify(optionalParams.filters);
        }

        if (optionalParams.fields) {
            const allFields = _concat([], pf.fields, optionalParams.fields);
            queryArgs.fields = _join(allFields, ',');
            pf.cols = brandViewColumns(allFields);
        }

        if (optionalParams.sort) {
            queryArgs.sort = JSON.stringify(optionalParams.sort);
        }

        if (optionalParams.per_page) {
            queryArgs.per_page = optionalParams.per_page;
        }

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/brand_views?${queryStr}`;

        await this.fetchAllPages(
            { relPath: path, actionMsg: 'fetching brand views' },
            opts.flags['max-page'],
            (res) => {
                this.outputRecords(res, pf.cols);
            }
        );
    }
}
