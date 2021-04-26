import ApiCommand from '../../api-command';

export default class FetchJobList extends ApiCommand {
    static description = `Return fetch jobs subitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static examples = ['$ lf-cli analytics:fetch-job-list'];

    async run() {
        const path = `/v20200626/analytics/fetch_job`;
        const res = await this.fetch(path, undefined, `fetching`);
        let cols = {};
        cols = {
            id: {},
            state: {},
        };

        this.outputRecords(res, cols);
    }
}
