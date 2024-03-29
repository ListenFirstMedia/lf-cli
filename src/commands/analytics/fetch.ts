import ApiCommand from '../../api-command';
import * as fs from 'node:fs';
import { parseStdin } from '../../utils';
import { pagingFlags } from '../../support/paging';
import { AnalyticalQuery, TableObjectResponse } from '../../lfapi/types';

export default class AnalyticsFetch extends ApiCommand {
    static description = `Perform an analytical query

Submit a multi-dimensional, aggregate, time series analytical query. 
Start and End time parameters are used to specify the time window of 
the query. The Dataset ID determines the scope of dimensions and 
metrics available in the query for selection, filtering, grouping, 
and sorting. Consult the Data Dictionary for available Datasets, 
Fields and their capabilities.
                   `;

    static flags = {
        ...pagingFlags,
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'query_file',
            description: 'a file containing the query json document',
            required: true,
            default: '-',
        },
    ];

    static examples = [
        '$ lf-cli analytics:fetch my-request.json',
        '$ cat my-request.json | lf-cli analytics:fetch',
        '$ lf-cli analytics:fetch --pretty my-request.json',
        '$ cat my-request.json | lf-cli analytics:fetch --max-page -1 --format doc --silent',
        '$ lf-cli analytics:fetch --max-page 2 --per-page 5 --format table my-request.json ',
        '$ lf-cli analytics:fetch --per-page 1000 --max-page -1 --format table --csv my-request.json >| my-response.csv',
        '$ lf-cli analytics:fetch --per-page 1000 --max-page -1 --format doc my-request.json >| my-response-docs.json',
        '$ lf-cli analytics:fetch --per-page 1000 --max-page -1 --format doc my-request.json >| my-response-docs.json',
        '$ lf-cli analytics:fetch --format table --csv --no-header my-request.json >| my-response-data.csv',
        '$ cat my-request.json | lf-cli analytics:fetch --show-curl',
        '$ cat my-request.json | lf-cli analytics:fetch --show-curl | sh',
    ];

    async run() {
        const opts = await this.parse(AnalyticsFetch);

        let query: AnalyticalQuery;

        if (opts.args.query_file === 'help') {
            await AnalyticsFetch.run(['-h']);
            this.exit(0);
        }

        if (opts.args.query_file === '-') {
            if (process.stdin.isTTY) {
                this.error(
                    'stdin specified for query file, but no data was provided',
                    { exit: 1 }
                );
            }

            query = await parseStdin();
        } else if (fs.existsSync(opts.args.query_file)) {
            const queryTemplate = fs.readFileSync(opts.args.query_file, 'utf8');
            query = JSON.parse(queryTemplate);
        } else {
            this.error(`query file ${opts.args.query_file} does not exist`, {
                exit: 2,
            });
        }

        if (opts.flags.page) {
            query.page = Number(opts.flags.page);
        }

        if (opts.flags['per-page']) {
            query.per_page = Number(opts.flags['per-page']);
        }

        const reqOpts = {
            method: 'post',
            body: JSON.stringify(query),
        };

        await this.fetchAllPages(
            {
                relPath: '/v20200626/analytics/fetch',
                actionMsg: 'fetching analysis results',
                fetchOpts: reqOpts,
            },
            opts.flags['max-page'],
            (res: TableObjectResponse) => {
                const cols: { [index: string]: any } = {};
                for (const [idx, col] of res.columns.entries()) {
                    cols[col.id as string] = {
                        header: col.name as string,
                        get: (row: any) => row[idx],
                    };
                }

                this.outputRecords(res, cols);
            }
        );
    }
}
