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

    static examples = ['$ lf-cli bulk-tag-ingest:get [filename]'];

    async run() {

        const opts = this.parse(BulkTagIngestGet);

        if (opts.args.ID === 'help') {
            await BulkTagIngestGet.run(['-h']);
            this.exit(0);
        }

        const jsonified = await csv()
        .fromFile(opts.args.filename)
        .then(function(result){
          return result;
        });

        const data = JSON.stringify(jsonified);

        const reqOpts = {
            method: 'POST',
            body: data,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(data).toString(),
            },
        };

        const res = await this.fetch(
            `/v20200626/bulk_tag`,
            reqOpts,
            `Ingesting tags`
        );

        this.outputRecords(res);
    }
}