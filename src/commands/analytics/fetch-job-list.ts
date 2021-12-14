import ApiCommand from '../../api-command';
import { flags } from '@oclif/command';

export default class FetchJobList extends ApiCommand {
    static description = `Return fetch jobs subitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
        'schedule-config-id': flags.integer({
            description:
                'Can be used to filter fetch job list by a particular schedule config.',
        }),
    };

    static examples = [
        '$ lf-cli analytics:fetch-job-list',
        '$ lf-cli analytics:fetch-job-list --schedule-config-id 10',
    ];

    async run() {
        const opts = this.parse(FetchJobList);

        let path = `/v20200626/analytics/fetch_job`;

        if (opts.flags.schedule_config_id) {
            path = `${path}?schedule_config_id=${opts.flags.schedule_config_id}`;
        }

        const res = await this.fetch(path, undefined, `fetching`);
        let cols = {};
        cols = {
            id: {},
            state: {},
        };

        this.outputRecords(res, cols);
    }
}
