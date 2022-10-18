import ApiCommand from '../../api-command';
import { mapValues as _mapValues } from 'lodash';
import { flags } from '@oclif/command';
import _fetch from 'node-fetch';
import { FieldBasic } from '../../lfapi/types';
import { cli } from 'cli-ux';
import * as cliProgress from 'cli-progress';

export default class FetchJobShow extends ApiCommand {
    static description = `Return a submitted fetch job.`;

    static flags = {
        ...ApiCommand.flags,
        download: flags.boolean({
            description:
                'Download the data and write to stdout. This flag will be ignored if the job is not in the completed state.',
        }),
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the Fetch Job to retrieve',
            required: true,
        },
    ];

    static examples = [
        '$ lf-cli analytics:fetch-job-show 32',
        '$ lf-cli analytics:fetch-job-show 32 --download',
        '$ lf-cli analytics:fetch-job-show 32 --download >| data.jsonl',
    ];

    async run() {
        const opts = this.parse(FetchJobShow);

        if (opts.args.ID === 'help') {
            await FetchJobShow.run(['-h']);
            this.exit(0);
        }

        if (!opts.args.ID.match(/^[\d]+$/i)) {
            this.error('Invalid Fetch Job ID', { exit: 1 });
        }

        const path = `/v20200626/analytics/fetch_job/${opts.args.ID}`;

        const res = await this.fetch(
            path,
            undefined,
            `fetching Fetch Job ${opts.args.ID}'`
        );

        if (opts.flags.download && res.record.state === 'completed') {
            // disabling no-await-in-loop to ensure serial execution so that
            // heap limit is not breached

            const total = res.record.page_urls.length;
            let progress = 0;
            process.stderr.write(`downloading ${total} pages...\n`);
            // cli.action.start(`downloading ${total} pages`);

            const progressBar = new cliProgress.SingleBar(
                {},
                cliProgress.Presets.shades_classic
            );
            progressBar.start(total, progress);

            /* eslint-disable no-await-in-loop */
            for (const url of res.record.page_urls) {
                progress += 1;
                progressBar.update(progress);
                // cli.action.start(`downloading page ${progress} of ${total}`);
                const data = await _fetch(url);
                if (url.endsWith('.csv')) {
                    const res = await data.text();
                    this.log(res);
                } else {
                    const obj = await data.json();
                    const cols: { [index: string]: any } = {};

                    obj.columns.forEach((col: FieldBasic, idx: number) => {
                        cols[col.id as string] = {
                            header: col.name as string,
                            get: (row: any) => row[idx],
                        };
                    });

                    this.outputRecords(obj, cols);
                }
            }
            progressBar.stop();
            cli.action.stop();
            /* eslint-enable no-await-in-loop */
        } else {
            let cols = {};
            cols = _mapValues(res.record, () => {
                return {};
            });

            this.outputRecords(res, cols);
        }
    }
}
