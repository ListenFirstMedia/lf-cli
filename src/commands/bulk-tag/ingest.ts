import * as fs from 'fs';
import ApiCommand from '../../api-command';

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

        const file_size = fs.statSync(opts.args.filename).size;
        const file_stream = fs.createReadStream(opts.args.filename);

        const reqOpts = {
            method: 'POST',
            body: file_stream,
            headers: {
                'content-type': 'text/csv',
                'content-length': file_size,
            },
            compress: true,
        };

        const res = await this.fetch(
            `/v20200626/bulk_tagging_job`,
            reqOpts,
            `Ingesting tags`
        );

        this.outputRecords(res);
    }
}
