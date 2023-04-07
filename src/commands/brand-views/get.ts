import ApiCommand from '../../api-command';
import {
    parseBrandViewFieldsFlag,
    brandViewFlags,
} from '../../support/brand-view-commands';

export default class BrandViewGet extends ApiCommand {
    static description = `Get a Brand View

Retrieve a Brand View by id.`;

    static flags = {
        ...brandViewFlags,
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the Brand View to retrieve',
            required: true,
        },
    ];

    static examples = [
        '$ lf-cli brand-views:get 31711',
        '$ lf-cli brand-views:get 31711 --pretty',
        '$ lf-cli brand-views:get 31711 --format table --fields lfm.brand.primary_genre,lfm.brand.programmers',
        '$ lf-cli brand-views:get --format doc --fields lfm.brand.primary_genre --pretty 31711',
    ];

    async run() {
        const opts = this.parse(BrandViewGet);

        if (opts.args.ID === 'help') {
            await BrandViewGet.run(['-h']);
            this.exit(0);
        }

        if (!/^\d+$/i.test(opts.args.ID)) {
            this.error('Invalid Brand View ID', { exit: 1 });
        }

        const pf = parseBrandViewFieldsFlag(opts.flags.fields);

        let path = `/v20200626/brand_views/${opts.args.ID}`;
        if (pf.fields.length > 0) {
            path = `${path}?fields=${opts.flags.fields}`;
        }

        const res = await this.fetch(
            path,
            undefined,
            `fetching Brand View ${opts.args.ID}'`
        );

        this.outputRecords(res, pf.cols);
    }
}
