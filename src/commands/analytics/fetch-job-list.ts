import ApiCommand from '../../api-command';
import * as querystring from 'querystring';
import { flags } from '@oclif/command';

export default class FetchJobList extends ApiCommand {
    static description = `Return fetch jobs subitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
        'schedule-config-id': flags.integer({
            description:
                'A filter used to select jobs created by the given schedule config identfier.',
        }),
    };

    static examples = [
        '$ lf-cli analytics:fetch-job-list',
        '$ lf-cli analytics:fetch-job-list --schedule-config-id 45',
    ];

    async run() {
        const opts = this.parse(FetchJobList);

        const queryArgs: { [index: string]: any } = {};

        if (opts.flags['schedule-config-id']) {
            queryArgs.schedule_config_id = Number(
                opts.flags['schedule-config-id']
            );
        }

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/analytics/fetch_job?${queryStr}`;

        const res = await this.fetch(path, undefined, `fetching`);
        let cols = {};
        cols = {
            id: {},
            state: {},
            created_at: {},
            updated_at: {},
        };

        this.outputRecords(res, cols);
    }
}
