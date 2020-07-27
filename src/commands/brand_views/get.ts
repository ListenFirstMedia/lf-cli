import ApiCommand from '../../api-command';
import { flags } from '@oclif/command';
import { split as _split, capitalize as _capitalize } from 'lodash';
import { Table } from 'cli-ux';

export default class BrandViewGet extends ApiCommand {
    static description = `Get a Brand View

Retrieve a Brand View by id.`;

    static flags = {
        fields: flags.string({
            description: 'Comma seperated list of fields to include',
            required: false,
        }),
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

        let fields: string[] = [];
        if (opts.flags.fields) {
            fields = _split(opts.flags.fields, ',');
        }

        let path = `/v20200626/brand_views/${opts.args.ID}`;
        if (fields.length > 0) {
            path = `${path}?fields=${opts.flags.fields}`;
        }

        const res = await this.fetch(
            path,
            undefined,
            `fetching Brand View ${opts.args.ID}'`
        );

        const cols: Table.table.Columns<any> = {
            id: {
                header: 'ID',
                minWidth: 10,
            },
            name: {
                header: 'Brand View Name',
            },
            brand_name: {
                header: 'Brand Name',
                get: (row) => row.dimensions['lfm.brand.name'],
            },
            type: {},
        };
        fields.forEach((field: string) => {
            cols[field] = {
                header: _capitalize(_split(field, '.').pop()),
                get: (row) => row.dimensions[field],
            };
        });
        this.outputRecords(res, cols);
    }
}
