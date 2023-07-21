import ApiCommand from '../../api-command';

export default class BrandViewSetGet extends ApiCommand {
    static description = `Get a Brand View Set

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

    static examples = [
        '$ lf-cli brand-view-sets:get 4626',
        '$ lf-cli brand-view-sets:get 4626 --pretty',
    ];

    async run() {
        const opts = await this.parse(BrandViewSetGet);

        if (opts.args.ID === 'help') {
            await BrandViewSetGet.run(['-h']);
            this.exit(0);
        }

        if (!/^\d+$/i.test(opts.args.ID)) {
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
