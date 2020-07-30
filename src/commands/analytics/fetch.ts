import { flags } from '@oclif/command';
import ApiCommand from '../../api-command';
import * as fs from 'fs';
import { parseStdin } from '../../utils';
import { pagingFlags } from '../../support/paging';

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
        fields: flags.boolean({
            description: 'list fields in output',
            default: true,
            allowNo: true,
        }),
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

    async run() {
        const opts = this.parse(AnalyticsFetch);

        let query: any;

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
            query = JSON.parse(fs.readFileSync(opts.args.query_file, 'utf-8'));
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
            (res) => {
                const cols: { [index: string]: any } = {};
                res.columns.forEach((col: any, idx: number) => {
                    cols[col.id as string] = {
                        header: col.name as string,
                        get: (row: any) => row[idx],
                    };
                });
                this.outputRecords(res, cols);
            }
        );
    }
}
