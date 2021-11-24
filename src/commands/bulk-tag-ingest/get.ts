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

        const opts = this.parse(BulkTagIngestGet);

        if (opts.args.ID === 'help') {
            await BulkTagIngestGet.run(['-h']);
            this.exit(0);
        }

        const jsonified = await csv()
        .fromFile('tags.csv')
        .then(function(result){
          return result;
        });

        const authData = JSON.stringify(jsonified);

        console.log('authData json', authData);

        // prepare the POST request
        const reqOpts = {
            method: 'POST',
            body: authData,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(authData).toString(),
            },
        };

        const res = await this.fetch(
            `/v20200626/tag`,
            reqOpts,
            `Ingesting tags`
        );

        this.outputRecords(res);
    }
}
