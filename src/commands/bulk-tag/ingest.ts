import * as querystring from 'querystring';
import ApiCommand from '../../api-command';
import { uploadFileViaSignedUrl } from '../../upload/signed-url';

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

    static runSynchronously = false;

    async run() {
        const opts = this.parse(BulkTagIngestGet);

        if (opts.args.ID === 'help') {
            await BulkTagIngestGet.run(['-h']);
            this.exit(0);
        }

        const signed_url_res = await uploadFileViaSignedUrl(
            opts.args.filename,
            (relPath, fetchOpts, actionMsg) => {
                return this.fetch(relPath, fetchOpts, actionMsg);
            }
        );
        const data = querystring.stringify({
            s3_bucket: signed_url_res.s3_bucket,
            s3_key: signed_url_res.s3_key,
            run_synchronously: BulkTagIngestGet.runSynchronously,
        });

        const reqOpts = {
            method: 'POST',
            body: data,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(data).toString(),
            },
        };

        const res = await this.fetch(
            `/v20200626/bulk_tagging_via_url_job`,
            reqOpts,
            `Ingesting tags`
        );

        this.outputRecords(res);
    }
}
