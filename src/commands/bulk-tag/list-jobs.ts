import * as fs from 'fs';
import ApiCommand from '../../api-command';
import * as csv from "csvtojson";

export default class BulkTagListJobs extends ApiCommand {
    static description = `List tag ingest jobs`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
    ];

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

        res['jobs'].map(rec => {
          console.log(`Job ${rec['job_id']} started ${rec['start_time']}`);
          if (rec['finished']) {
            console.log(`Finished ${rec['end_time']} duration ${rec['duration']}s`);
          } else {
            console.log('Not finished');
          }
          console.log('');
        });
    }
}
