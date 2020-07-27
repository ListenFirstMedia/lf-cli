import ApiCommand from '../../api-command';
import { flags } from '@oclif/command';
import * as querystring from 'querystring';
import {
    parseBrandViewFieldsFlag,
    brandViewFlags,
} from '../../support/brand-view-commands';

export default class BrandViewsList extends ApiCommand {
    static description = `List Brand Views

Returns an array of all Brand Views available to the ListenFirst 
Account associated with the access token. Results may be filtered 
and sorted by Brand Metadata Dimensions.`;

    static flags = {
        ...brandViewFlags,
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

        const pf = parseBrandViewFieldsFlag(opts.flags.fields);

        if (pf.fields.length > 0) {
            queryArgs.fields = opts.flags.fields;
        }

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/brand_views?${queryStr}`;

        let total = 0;
        await this.fetchAllPages(
            { relPath: path, actionMsg: 'fetching brand views' },
            opts.flags['max-page'],
            (res) => {
                total += res.records.length;
                this.outputRecords(res, pf.cols);
            }
        );

        this.log('total results: ' + total);
    }
}
