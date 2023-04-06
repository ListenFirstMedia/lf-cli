import ApiCommand from '../../api-command';
import * as querystring from 'node:querystring';
import {
    parseBrandViewFieldsFlag,
    brandViewFlags,
} from '../../support/brand-view-commands';
import { pagingFlags } from '../../support/paging';
import { join as _join } from 'lodash';

export abstract class BrandViewsByBrandSetNameCommand extends ApiCommand {
    static flags = {
        ...brandViewFlags,
        ...pagingFlags,
        ...ApiCommand.flags,
    };

    async process(flags: any, brandSetName: string) {
        const queryArgs: { [index: string]: any } = {
            per_page: 1000,
            page: flags.page,
        };
        if (flags['per-page']) {
            queryArgs.per_page = Number(flags['per-page']);
        }

        const pf = parseBrandViewFieldsFlag(flags.fields);

        if (pf.fields.length > 0) {
            queryArgs.fields = flags.fields;
        }

        const filters = [
            {
                field: 'lfm.brand_view.set_names',
                operator: 'IN',
                values: [brandSetName],
            },
        ];

        queryArgs.filters = JSON.stringify(filters);

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/brand_views?${queryStr}`;

        await this.fetchAllPages(
            { relPath: path, actionMsg: 'fetching brand views' },
            flags['max-page'],
            (res) => {
                this.outputRecords(res, pf.cols);
            }
        );
    }
}

export default class BrandViewsByBrandSetName extends BrandViewsByBrandSetNameCommand {
    static description = `List Brands from the specified Brand View Set

Convenience command to fetch the Brand Views associated with the specified (by name)
Brand View Set`;

    static flags = {
        ...BrandViewsByBrandSetNameCommand.flags,
    };

    static args = [
        {
            name: 'brand_set_name',
            description: 'a brand set to fetch',
            required: true,
        },
    ];

    static strict = false;

    static examples = [
        '$ lf-cli brand-views:by-brand-set-name --pretty --fields lfm.brand.primary_genre My Brands',
        '$ lf-cli brand-views:by-brand-set-name --max-page -1 --format table LF // TV Universe',
        '$ lf-cli brand-views:by-brand-set-name --max-page -1 --format table LF // TV Universe',
    ];

    async run() {
        const opts = this.parse(BrandViewsByBrandSetName);
        if (opts.args.brand_set_name === 'help') {
            await BrandViewsByBrandSetName.run(['-h']);
            this.exit(0);
        }

        await this.process(opts.flags, _join(opts.argv, ' '));
    }
}
