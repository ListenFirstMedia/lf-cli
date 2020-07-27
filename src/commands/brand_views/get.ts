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

    async run() {
        const opts = this.parse(BrandViewGet);

        if (!opts.args.ID.match(/^[\d]+$/i)) {
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
