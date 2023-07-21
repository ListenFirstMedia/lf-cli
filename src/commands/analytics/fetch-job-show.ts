import ApiCommand from '../../api-command';
import * as fetchJobCommand from '../../support/fetch-job-commands';

export default class FetchJobShow extends ApiCommand {
    static description = `Return a submitted fetch job.`;

    static flags = {
        ...ApiCommand.flags,
        ...fetchJobCommand.downloadFlags,
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the Fetch Job to retrieve',
            required: true,
        },
    ];

    static examples = [
        '$ lf-cli analytics:fetch-job-show 32',
        '$ lf-cli analytics:fetch-job-show 32 --download',
        '$ lf-cli analytics:fetch-job-show 32 --download >| data.jsonl',
    ];

    displayJob = fetchJobCommand.displayJob.bind(this);

    async run() {
        const opts = await this.parse(FetchJobShow);

        if (opts.args.ID === 'help') {
            await FetchJobShow.run(['-h']);
            this.exit(0);
        }

        if (!/^\d+$/i.test(opts.args.ID)) {
            this.error('Invalid Fetch Job ID', { exit: 1 });
        }

        const path = `/v20200626/analytics/fetch_job/${opts.args.ID}`;

        await this.displayJob(
            path,
            opts,
            `Fetching fetch job ${opts.args.ID}.`
        );
    }
}
