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

        //const authData = JSON.stringify(jsonified);

        // prepare the POST request
        const reqOpts = {
            method: 'GET',
            //body: authData,
            //headers: {
            //'content-type': 'application/x-www-form-urlencoded',
            //'content-length': Buffer.byteLength(authData).toString(),
            //},
        };

        const res = await this.fetch(
            `/v20200626/bulk_tag_jobs`,
            reqOpts,
            `Listing jobs`
        );

        this.outputRecords(res);
    }
}
