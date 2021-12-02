import * as fs from 'fs';
import ApiCommand from '../../api-command';
import * as csv from "csvtojson";
import * as querystring from 'querystring';
import { stringify } from 'csv-stringify';

export default class BulkTagGetJobResults extends ApiCommand {
    static description = `Get bulk tag job results`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'job_id',
            description: 'bulk tag job to get results of',
            required: true,
        },
        {
            name: 'filename',
            description: 'file to write jobs results to',
            required: true,
        },
    ];

    static examples = ['$ lf-cli bulk-tag-get-job-results:get [job_id] [filename]'];

    async run() {

        const opts = this.parse(BulkTagGetJobResults);

        if (opts.args.ID === 'help') {
            await BulkTagGetJobResults.run(['-h']);
            this.exit(0);
        }

        const job_id = opts.args.job_id;
        const queryArgs = { job_id: job_id };
        const queryStr = querystring.stringify(queryArgs);

        //const path = `/v20200626/brand_view_sets?${queryStr}`;
        //const data = JSON.stringify({ job_id: job_id });
        //const data = { job_id: job_id };

        // prepare the POST request
        const reqOpts = {
          method: 'GET',
          //job_id: job_id,
            //body: data,
            //headers: {
            //'content-type': 'application/x-www-form-urlencoded',
            //'content-length': Buffer.byteLength(authData).toString(),
            //},
        };

        const headers = [
          'error',
          'translated url',
          'dcs_uid',
          'channel',
          'profile_type',
          'original input...'
        ];
     
        const res = await this.fetch(
        `/v20200626/bulk_tag_results?${queryStr}`,
            reqOpts,
            `Fetching job results`
        );

        const filename = opts.args.filename;

        const rows = res.map(rec =>
          headers.map(k => rec[k]));

        stringify(rows, function (err, output) {
          output = headers.join(",") + "\n" + output;

          fs.writeFile(filename, output, err => {
            if (err) {
              console.error(err)
              return
            }
          })
        });

        //this.outputRecords(res);
    }
}
