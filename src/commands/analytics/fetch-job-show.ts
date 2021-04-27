import ApiCommand from '../../api-command';
import { mapValues as _mapValues } from 'lodash';
import { flags } from '@oclif/command';
import _fetch from 'node-fetch';

export default class FetchJobShow extends ApiCommand {
    static description = `Return a submitted fetch job.`;

    static flags = {
        ...ApiCommand.flags,
	'download': flags.boolean({
            description: 'Download the data and write to stdout. This flag will be ignored if the job is not in the completed state.'
        })
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the Fetch Job to retrieve',
            required: true,
        },
    ];

    static examples = ['$ lf-cli analytics:fetch-job-show 32'];

    async run() {
        const opts = this.parse(FetchJobShow);

        if (opts.args.ID === 'help') {
            await FetchJobShow.run(['-h']);
            this.exit(0);
        }

        if (!opts.args.ID.match(/^[\d]+$/i)) {
            this.error('Invalid Fetch Job ID', { exit: 1 });
        }

        let path = `/v20200626/analytics/fetch_job/${opts.args.ID}`;

        const res = await this.fetch(
            path,
            undefined,
            `fetching Fetch Job ${opts.args.ID}'`
        );

	if (opts.flags['download'] && res.record.state == 'completed') {
	    for (let file of res.record.page_urls) {
		const data = await _fetch(file);
		const res = await data.json();
		const cols: { [index: string]: any } = {};
                res.columns.forEach((col: FieldBasic, idx: number) => {
		    cols[col.id as string] = {
                        header: col.name as string,
                        get: (row: any) => row[idx],
		    };
                });

		this.outputRecords(res, cols);
	    }
	} else {

            let cols = {};
            cols = _mapValues(res.record, () => {
		return {};
            });

            this.outputRecords(res, cols);
	} 
    }
}
