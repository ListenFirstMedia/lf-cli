import ApiCommand from '../../api-command';
import * as fetchJobCommand from '../../support/fetch-job-commands';

export default class FetchJobLatest extends ApiCommand {
    static description = `Return latest fetch job submitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
        ...fetchJobCommand.filterFlags,
        ...fetchJobCommand.downloadFlags,
    };

    static examples = [
        '$ lf-cli analytics:fetch-job-latest',
        '$ lf-cli analytics:fetch-job-latest --schedule-config-id 45',
        '$ lf-cli analytics:fetch-job-latest --client-context test_context',
        '$ lf-cli analytics:fetch-job-latest --client-context "test context"',
    ];

    displayJob = fetchJobCommand.displayJob.bind(this);

    async run() {
        const endpoint = `/v20200626/analytics/fetch_job/latest`;
        const opts = this.parse(FetchJobLatest);
        const path = fetchJobCommand.processFilters(endpoint, opts);

        await this.displayJob(path, opts, `Fetching latest fetch job.`);
    }
}
