import ApiCommand from '../../api-command';
import * as _ from 'lodash';
import { table } from 'cli-ux/lib/styled/table';

export default class DatasetsFieldValues extends ApiCommand {
    static description = 'Retrieve all distinct values for a given Field';

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'field',
            description: 'the ID of the Field to retrieve',
            required: true,
        },
    ];

    static examples = [
        '$ lf-cli datasets:field-values lfm.brand.genres',
        '$ lf-cli datasets:field-values --pretty lfm.brand.genres',
        '$ lf-cli datasets:field-values --format table --no-header lfm.brand.genres',
        '$ lf-cli datasets:field-values --format table --no-header --silent lfm.brand.genres | sort',
    ];

    async run() {
        const opts = this.parse(DatasetsFieldValues);

        if (opts.args.field === 'help') {
            await DatasetsFieldValues.run(['-h']);
            this.exit(0);
        }

        // eslint doesn't like the \. escape in the regexp but it's required
        // eslint-disable-next-line no-useless-escape
        if (!opts.args.field.match(/^[\w\._]+$/i)) {
            this.error('Invalid dataset field ID');
            this.exit(1);
        }

        const res = await this.fetch(
            `/v20200626/dictionary/field_values?field=${opts.args.field}`,
            undefined,
            `fetching field values for ${opts.args.field}'`
        );

        const cols: table.Columns<any> = { value: {} };
        if (opts.flags.format === 'table') {
            res.records = _.map(res.records, (val) => {
                return { value: val };
            });
        }

        this.outputRecords(res, cols);
    }
}
