import ApiCommand from '../../api-command';

export default class BrandViewSetGet extends ApiCommand {
    static description = `Get a Brand View Aet

Retrieve a Brand View Set by id.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the Brand View Set to retrieve',
            required: true,
        },
    ];

    async run() {
        const opts = this.parse(BrandViewSetGet);

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
