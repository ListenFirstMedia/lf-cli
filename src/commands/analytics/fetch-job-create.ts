import ApiCommand from '../../api-command';
import * as fs from 'node:fs';
import { parseStdin } from '../../utils';
import { mapValues as _mapValues } from 'lodash';
import { FetchJob } from '../../lfapi/types';

export default class FetchJobCreate extends ApiCommand {
    static description = `Submit a new fetch job. 

A fetch job is similar to a request submitted through the fetch endpoint. Infact, 
it uses the same request syntax. It differs however, in that it
follows an asynchronous workflow. The fetch job is submitted to our
specialized backend systems that allow for larger and long running
queries. Users can poll using the analytics:fetch-job-show <id> method
to check for job completion. 
`;

    static flags = {
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

    static examples = ['$ lf-cli analytics:fetch-job-create my-request.json'];

    async run() {
        const opts = await this.parse(FetchJobCreate);
        let query_req: FetchJob;

        if (opts.args.query_file === 'help') {
            await FetchJobCreate.run(['-h']);
            this.exit(0);
        }

        if (opts.args.query_file === '-') {
            if (process.stdin.isTTY) {
                this.error(
                    'stdin specified for query file, but no data was provided',
                    { exit: 1 }
                );
            }

            query_req = await parseStdin();
        } else if (fs.existsSync(opts.args.query_file)) {
            const queryTemplate = fs.readFileSync(opts.args.query_file, 'utf8');
            query_req = await JSON.parse(queryTemplate);
        } else {
            this.error(`query file ${opts.args.query_file} does not exist`, {
                exit: 2,
            });
        }

        const reqOpts = {
            method: 'post',
            body: JSON.stringify(query_req),
        };

        const path = `/v20200626/analytics/fetch_job`;
        const res = await this.fetch(path, reqOpts, `Creating fetch job.`);

        let cols = {};
        cols = _mapValues(res.record, () => {
            return {};
        });

        this.outputRecords(res, cols);
    }
}
