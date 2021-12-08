import ApiCommand from '../../api-command';

export default class BulkTagListJobs extends ApiCommand {
    static description = `List tag ingest jobs`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [];

    static examples = ['$ lf-cli bulk-tag-list-jobs:get'];

    async run() {
        const opts = this.parse(BulkTagListJobs);

        if (opts.args.ID === 'help') {
            await BulkTagListJobs.run(['-h']);
            this.exit(0);
        }

        const reqOpts = {
            method: 'GET',
        };

        const res = await this.fetch(
            `/v20200626/bulk_tagging_job`,
            reqOpts,
            `Listing jobs`
        );

        const log = (s: any) => this.log(s);
        res.jobs.forEach((rec: any) => {
            log(`Job ${rec.job_id} started ${rec.start_time}`);
            if (rec.finished) {
                log(`Finished ${rec.end_time} duration ${rec.duration}s`);
            } else {
                log('Not finished');
            }
            log('');
        });
    }
}
