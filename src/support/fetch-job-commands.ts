import ApiCommand from '../api-command';
import { mapValues as _mapValues } from 'lodash';
import * as querystring from 'querystring';
import { flags } from '@oclif/command';
import * as Parser from '@oclif/parser';
import _fetch from 'node-fetch';
import { FieldBasic } from '../lfapi/types';
import { cli } from 'cli-ux';
import * as cliProgress from 'cli-progress';

export const downloadFlags = {
    download: flags.boolean({
        description:
            'Download the data and write to stdout. This flag will be ignored if the job is not in the completed state.',
    }),
};

export const filterFlags = {
    'schedule-config-id': flags.integer({
        description:
            'A filter used to select jobs created by the given schedule config identfier.',
    }),
    'client-context': flags.string({
        description:
            'A filter used to select jobs created with the given client context.',
    }),
};

export async function displayJob(
    this: ApiCommand,
    path: string,
    opts: Parser.Output<any, any>,
    msg: string
) {
    // fields: string[]): Table.table.Columns<any> {
    const res = await this.fetch(path, undefined, msg);

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

export function processFilters(
    endpoint: string,
    opts: Parser.Output<any, any>
) {
    const queryArgs: { [index: string]: any } = {};

    if (opts.flags['schedule-config-id']) {
        queryArgs.schedule_config_id = Number(opts.flags['schedule-config-id']);
    }

    if (opts.flags['client-context']) {
        queryArgs.client_context = opts.flags['client-context'];
    }

    const queryStr = querystring.stringify(queryArgs);
    return `${endpoint}?${queryStr}`;
}
