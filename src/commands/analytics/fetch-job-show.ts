import ApiCommand from '../../api-command';
import { mapValues as _mapValues } from 'lodash';

export default class FetchJobShow extends ApiCommand {
    static description = `Return a submitted fetch job.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the Fetch Job to retrieve',
            required: true,
        },
    ];

    static examples = ['$ lf-cli analytics:fetch-job-show 32'];

    async run() {
        const opts = this.parse(FetchJobShow);

        if (opts.args.ID === 'help') {
            await FetchJobShow.run(['-h']);
            this.exit(0);
        }

        if (!opts.args.ID.match(/^[\d]+$/i)) {
            this.error('Invalid Fetch Job ID', { exit: 1 });
        }

        let path = `/v20200626/analytics/fetch_job/${opts.args.ID}`;

        const res = await this.fetch(
            path,
            undefined,
            `fetching Fetch Job ${opts.args.ID}'`
        );

        let cols = {};
        cols = _mapValues(res, () => {
            return {};
        });

        this.outputRecords(res, cols);
    }
}
