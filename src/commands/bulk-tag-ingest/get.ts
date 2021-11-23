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

    static examples = ['$ lf-cli bulk-tag-ingest:get tags.csv'];

    async run() {
        const opts = this.parse(BulkTagIngestGet);
        console.log('hey');
        console.log(opts.args.filename);

        // const fopts = { 'job_id': 5678, 'filename': 'input.csv' };
        // const response = await fetch('https://httpbin.org/post', {method: 'POST', body: 'a=1'});
        const params = new URLSearchParams();
        params.append('job_id', 5678);
        params.append('filename', 'input.csv');

        const fopts = { method: 'POST', body: JSON.stringify(params) };

        //const response = await fetch('https://httpbin.org/post', {method: 'POST', body: params});
        //const data = await response.json();

        /*
        const res3 = await this.fetch(
            `/v20200626/tag`,
            fopts, // undefined,
            `fetching Brand View Set 5678'`
        );
        */
        const res3 = await this.fetch(
            `/v20200626/tag?job_id=5678&filename=input.csv`,
            undefined,
            `fetching Brand View Set 5678'`
        );

        const cols2 = {
            id: {
                header: 'ID',
                minWidth: 10,
            },
            name: {},
        };

        this.outputRecords(res3, cols2);

        // process.exit();
        return;

        const res2 = await this.fetch(
            `/v20200626/brand_view_sets/${opts.args.ID}`,
            undefined,
            `fetching Brand View Set ${opts.args.ID}'`
        );

        if (opts.args.ID === 'help') {
            await BrandViewSetGet.run(['-h']);
            this.exit(0);
        }

        if (!opts.args.ID.match(/^[\d]+$/i)) {
            this.error('Invalid Brand View Set ID', { exit: 1 });
        }

        const res = await this.fetch(
            `/v20200626/brand_view_sets/${opts.args.ID}`,
            undefined,
            `fetching Brand View Set ${opts.args.ID}'`
        );

        const cols = {
            id: {
                header: 'ID',
                minWidth: 10,
            },
            name: {},
        };

        this.outputRecords(res, cols);
    }
}
