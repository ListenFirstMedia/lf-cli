import * as fs from 'fs';
import * as querystring from 'querystring';
import ApiCommand from '../../api-command';
import { uploadFileViaSignedUrl } from '../../upload/signed-url';
import * as crypto from 'crypto';

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

    calc_md5_hash(filename: string) {
        const data = fs.readFileSync(filename);
        const hash = crypto.createHash('md5').update(data).digest('hex');
        return hash;
    }

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
        const uri = `s3://${signed_url_res.s3_bucket}/${signed_url_res.s3_key}`;
        const md5_hash = this.calc_md5_hash(opts.args.filename);

        const data = querystring.stringify({ uri, md5_hash });

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
