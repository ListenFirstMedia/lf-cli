import ApiCommand from '../../api-command';
import * as fetchJobCommand from '../../support/fetch-job-commands';

export default class FetchJobList extends ApiCommand {
    static description = `Return fetch jobs submitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
        ...fetchJobCommand.filterFlags,
    };

    static examples = [
        '$ lf-cli analytics:fetch-job-list',
        '$ lf-cli analytics:fetch-job-list --schedule-config-id 45',
        '$ lf-cli analytics:fetch-job-list --client-context test_context',
        '$ lf-cli analytics:fetch-job-list --client-context "test context"',
    ];

    async run() {
        const endpoint = `/v20200626/analytics/fetch_job`;
        const opts = this.parse(FetchJobList);
        const path = fetchJobCommand.processFilters(endpoint, opts);

        const res = await this.fetch(path, undefined, `Fetching fetch jobs.`);
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
