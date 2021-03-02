import ApiCommand from '../../api-command';
import * as fs from 'fs';
import { parseStdin, parseTemplate } from '../../utils';
import { mapValues as _mapValues } from 'lodash';

export default class FetchJobCreate extends ApiCommand {
    static description = `Return a submitted fetch job.`;

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

        const opts = this.parse(FetchJobCreate);
        let query: AnalyticalQuery;
	let query_req = {};

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

            query = await parseStdin();
        } else if (fs.existsSync(opts.args.query_file)) {
            const queryTemplate = fs.readFileSync(
                opts.args.query_file,
                'utf-8'
            );
            query = await JSON.parse(parseTemplate(queryTemplate));
	    query_req['fetch_params'] = query;
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
	const res = await this.fetch(path, reqOpts, `Creating fetch jobs.`);

        let cols = {};
        cols = _mapValues(res, () => {
            return {};
        });

	this.outputRecords(res, cols);

    }
}
