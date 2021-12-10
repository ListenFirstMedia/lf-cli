import * as fs from 'fs';
import ApiCommand from '../../api-command';
import _fetch from 'node-fetch';

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

    static examples = [
        '$ lf-cli bulk-tag-get-job-results:get [job_id] [filename]',
    ];

    async run() {
        const opts = this.parse(BulkTagGetJobResults);

        if (opts.args.ID === 'help') {
            await BulkTagGetJobResults.run(['-h']);
            this.exit(0);
        }

        const job_id = opts.args.job_id;

        const reqOpts = {
            method: 'GET',
        };

        const res = await this.fetch(
            `/v20200626/bulk_tagging_job/${job_id}`,
            reqOpts,
            `Fetching job results`
        );

        const { results_url } = res;
        const filename = opts.args.filename;
        await this.download_file(results_url, filename);
    }

    async download_file(url: string, path: string) {
        const res = await _fetch(url);
        const file_stream = fs.createWriteStream(path);

        await new Promise((resolve, reject) => {
            res.body.pipe(file_stream);
            res.body.on('error', reject);
            file_stream.on('finish', resolve);
        });
    }
}
