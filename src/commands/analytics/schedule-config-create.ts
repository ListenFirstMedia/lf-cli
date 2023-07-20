import ApiCommand from '../../api-command';
import * as fs from 'node:fs';
import { parseStdin } from '../../utils';
import { mapValues as _mapValues } from 'lodash';
import { ScheduleConfig } from '../../lfapi/types';

export default class ScheduleConfigCreate extends ApiCommand {
    static description = `Create a new schedule config. 

A schedule configuration creates a series of fetch job based on the cron expression specified. This allows the user to scheduled data requests on an ongoing manner in an automated manner. 
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

    static examples = [
        '$ lf-cli analytics:schedule-config-create my-request.json',
    ];

    async run() {
        const opts = this.parse(ScheduleConfigCreate);
        let query_req: ScheduleConfig;

        if (opts.args.query_file === 'help') {
            await ScheduleConfigCreate.run(['-h']);
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

        const path = `/v20200626/analytics/schedule_config`;
        const res = await this.fetch(
            path,
            reqOpts,
            `Creating schedule config.`
        );

        let cols = {};
        cols = _mapValues(res.record, () => {
            return {};
        });

        this.outputRecords(res, cols);
    }
}
