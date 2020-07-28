import ApiCommand from '../../api-command';
import * as querystring from 'querystring';
import {
    parseBrandViewFieldsFlag,
    brandViewFlags,
} from '../../support/brand-view-commands';
import { pagingFlags } from '../../support/paging';

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
