import * as querystring from 'querystring';
import * as fs from 'fs';
import ApiCommand from '../../api-command';
import * as csv from "csvtojson";

export default class BulkTagIngestGet extends ApiCommand {
    static description = `Ingest tags`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'filename',
            description: 's3 file to ingest',
            required: true,
        },
    ];

    static examples = ['$ lf-cli bulk-tag-ingest:get tags.csv'];

    async run() {
    /* GET with filename
        const opts = this.parse(BulkTagIngestGet);

        if (opts.args.ID === 'help') {
            await BulkTagIngestGet.run(['-h']);
            this.exit(0);
        }

        const filename = opts.args.filename;

        const res = await this.fetch(
            `/v20200626/tag?job_id=5678&filename=${filename}`,
            undefined,
            `Ingesting tags from ${filename}'`
        );

        this.outputRecords(res);
        */

        const opts = this.parse(BulkTagIngestGet);

        if (opts.args.ID === 'help') {
            await BulkTagIngestGet.run(['-h']);
            this.exit(0);
        }

        //const csv_contents = fs.readFileSync('tags.csv','utf8');
        //console.log('tags.csv contents', csv_contents);
        const jsonified = await csv(/*{
            output: "csv"
            }*/)
        //.fromString(csv_contents)
        .fromFile('tags.csv')
        .then(function(result){
          console.log('csv result', result);
          //const jsonified = result;
          console.log('jsonified', result);
          return result;
        });
        //console.flush();
        //process.exit();

        const authData = JSON.stringify(jsonified);

        /*
        const authData = JSON.stringify({
        job_id: 5678,
        filename: 'input.csv'
        });
        */
        console.log('authData json', authData);
        //const authData = "5678,input.csv\n";

        // prepare the POST request
        const authReqOpts = {
            method: 'POST',
            body: authData,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(authData).toString(),
            },
        };

        const res = await this.fetch(
            `/v20200626/tag`,
            authReqOpts,
            `Ingesting tags`
        );

        this.outputRecords(res);
    }
}
