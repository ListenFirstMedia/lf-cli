import ApiCommand from '../../api-command';
import * as querystring from 'querystring';
import { flags } from '@oclif/command';

export default class FetchJobList extends ApiCommand {
    static description = `Return fetch jobs submitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
        'schedule-config-id': flags.integer({
            description:
                'A filter used to select jobs created by the given schedule config identfier.',
        }),
        'client-context': flags.string({
            description:
                'A filter used to select jobs created with the given client context.',
        }),
    };

    static examples = [
        '$ lf-cli analytics:fetch-job-list',
        '$ lf-cli analytics:fetch-job-list --schedule-config-id 45',
        '$ lf-cli analytics:fetch-job-list --client-context test_context',
        '$ lf-cli analytics:fetch-job-list --client-context "test context"',
    ];

    async run() {
        const opts = this.parse(FetchJobList);

        const queryArgs: { [index: string]: any } = {};

        if (opts.flags['schedule-config-id']) {
            queryArgs.schedule_config_id = Number(
                opts.flags['schedule-config-id']
            );
        }

        if (opts.flags['client-context']) {
            queryArgs.client_context = opts.flags['client-context'];
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
            client_context: {},
            schedule_config_id: {},
        };

        this.outputRecords(res, cols);
    }
}
