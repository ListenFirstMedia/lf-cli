import { flags } from '@oclif/command';
import ApiCommand from '../../api-command';
import * as _ from 'lodash';
import { table } from 'cli-ux/lib/styled/table';

export default class DatasetsGet extends ApiCommand {
    static description = `Show a single dataset

Retrieve a single Dataset by its unique identifier. All the 
dataset's attributes and fields will be returned.`;

    static flags = {
        fields: flags.boolean({
            description: 'list fields in output',
            default: true,
            allowNo: true,
        }),
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'ID',
            description: 'the Dataset ID to retrieve',
            required: true,
        },
    ];

    async run() {
        const opts = this.parse(DatasetsGet);

        if (!opts.args.ID.match(/^[\w_]+$/i)) {
            this.error('Invalid Dataset ID');
            this.exit(1);
        }

        const res = await this.fetch(
            `/v20200626/dictionary/datasets/${opts.args.ID}`,
            undefined,
            `fetching ${opts.args.ID}'`
        );

        let cols: table.Columns<any> = {};
        if (res.record) {
            cols = _.mapValues(res.record, () => {
                return {};
            });
        }

        if (opts.flags.fields === false) {
            delete res.record.fields;
        } else if (opts.flags.format === 'table') {
            res.records = res.record.fields;
            delete res.record;
            cols = _.mapValues(res.records[0], () => {
                return {};
            });
        }

        this.outputRecords(res, cols);
    }
}
