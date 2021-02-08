import ApiCommand from '../../api-command';
import { mapValues as _mapValues } from 'lodash';

export default class DataStatus extends ApiCommand {
    static description = `Get data status`;

    static flags = {
        ...ApiCommand.flags,
    };

    static examples = ['$ lf-cli platform:data-status'];

    async run() {
        const path = `/v20200626/platform/data_status`;
        const res = await this.fetch(path, undefined, `fetching data_status`);
        const apiFlags = this.parsedApiFlags();
        let cols = {};
        cols = _mapValues(res, () => {
            return {};
        });

        if (apiFlags.format && apiFlags.format !== 'raw') {
            const wrappedRes = { record: res };
            this.outputRecords(wrappedRes, cols);
        } else {
            this.outputRecords(res, cols);
        }
    }
}
