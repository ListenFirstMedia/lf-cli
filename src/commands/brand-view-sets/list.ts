import ApiCommand from '../../api-command';
import { pagingFlags } from '../../support/paging';
import BrandViewsList from '../brand-views/list';
import * as querystring from 'node:querystring';

export default class BrandViewSetsList extends ApiCommand {
    static description = `List Brand View Sets
    
Retrieve the list of a Brand View Sets available to the ListenFirst 
Account associated with the access token.`;

    static flags = {
        ...pagingFlags,
        ...ApiCommand.flags,
    };

    static examples = [
        '$ lf-cli brand-view-sets:list --per-page 1000 --pretty',
        '$ lf-cli brand-view-sets:list --format table --max-page -1 --silent',
        '$ lf-cli brand-view-sets:list --max-page -1 --silent --format table --csv > all-brand-sets.csv',
        '$ lf-cli brand-view-sets:list --max-page -1 --format doc > all-brand-sets.jsonl',
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

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/brand_view_sets?${queryStr}`;

        const cols = {
            id: {
                header: 'ID',
                minWidth: 10,
            },
            name: {},
        };

        await this.fetchAllPages(
            {
                relPath: path,
                actionMsg: 'fetching brand view sets',
            },
            opts.flags['max-page'],
            (res) => {
                this.outputRecords(res, cols);
            }
        );
    }
}
