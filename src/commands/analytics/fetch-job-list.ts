import ApiCommand from '../../api-command';
import { mapValues as _mapValues } from 'lodash';

export default class FetchJobList extends ApiCommand {
    static description = `Return a submitted fetch job.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static examples = ['$ lf-cli analytics:fetch-job-list'];

    async run() {
        const path = `/v20200626/analytics/fetch_job`;
        const res = await this.fetch(path, undefined, `fetching`);
        const apiFlags = this.parsedApiFlags();
        let cols = {};
        cols = _mapValues(res, () => {
            return {};
        });

        if (apiFlags.format && apiFlags.format !== 'raw') {
            const wrappedRes = { record: res };
            this.outputRecords(wrappedRes, cols);
        } else {
            this.outputRecords(res, cols);
        }
    }
}
