import ApiCommand from '../../api-command';
import { flags } from '@oclif/command';
import * as querystring from 'querystring';
import { split as _split, capitalize as _capitalize } from 'lodash';
import { Table } from 'cli-ux';

export default class BrandViewsList extends ApiCommand {
    static description = `List Brand Views

Returns an array of all Brand Views available to the ListenFirst 
Account associated with the access token. Results may be filtered 
and sorted by Brand Metadata Dimensions.`;

    static flags = {
        fields: flags.string({
            description: 'Comma seperated list of fields to include',
            required: false,
        }),
        'per-page': flags.integer({
            description: 'number of results per page',
            default: 1000,
        }),
        page: flags.integer({
            description: 'starting page number',
            default: 1,
        }),
        'max-page': flags.integer({
            description: 'the max page number to fetch (-1 for all pages)',
            default: 1,
        }),
        ...ApiCommand.flags,
    };

    async run() {
        const opts = this.parse(BrandViewsList);
        const queryArgs: { [index: string]: any } = {
            per_page: opts.flags['per-page'],
            page: opts.flags.page,
        };

        let fields: string[] = [];
        if (opts.flags.fields) {
            fields = _split(opts.flags.fields, ',');
        }

        const cols: Table.table.Columns<any> = {
            id: {
                header: 'ID',
                minWidth: 10,
            },
            name: {
                header: 'Brand View Name',
            },
            brand_name: {
                header: 'Brand Name',
                get: (row) => row.dimensions['lfm.brand.name'],
            },
        };

        if (fields.length > 0) {
            queryArgs.fields = opts.flags.fields;
            fields.forEach((field: string) => {
                cols[field] = {
                    header: _capitalize(_split(field, '.').pop()),
                    get: (row) => row.dimensions[field],
                };
            });
        }

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/brand_views?${queryStr}`;

        let total = 0;
        await this.fetchAllPages(
            { relPath: path, actionMsg: 'fetching brand views' },
            opts.flags['max-page'],
            (res) => {
                total += res.records.length;
                this.outputRecords(res, cols);
            }
        );

        this.log('total results: ' + total);
    }
}
