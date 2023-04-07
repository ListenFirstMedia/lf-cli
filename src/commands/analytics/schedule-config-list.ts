import ApiCommand from '../../api-command';
import * as querystring from 'node:querystring';
import { flags } from '@oclif/command';

export default class ScheduleConfigList extends ApiCommand {
    static description = `Return schedule configs submitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
        'client-context': flags.string({
            description:
                'A filter used to select jobs created with the given client context.',
        }),
    };

    static examples = [
        '$ lf-cli analytics:schedule-config-list',
        '$ lf-cli analytics:schedule-config-list --client-context test_context',
        '$ lf-cli analytics:schedule-config-list --client-context "test context"',
    ];

    async run() {
        const opts = this.parse(ScheduleConfigList);

        const queryArgs: { [index: string]: any } = {};

        if (opts.flags['client-context']) {
            queryArgs.client_context = opts.flags['client-context'];
        }

        const queryStr = querystring.stringify(queryArgs);
        const path = `/v20200626/analytics/schedule_config?${queryStr}`;

        const res = await this.fetch(
            path,
            undefined,
            `Fetching schedule configs.`
        );
        let cols = {};
        cols = {
            id: {},
            state: {},
            created_at: {},
            updated_at: {},
            client_context: {},
        };

        this.outputRecords(res, cols);
    }
}
