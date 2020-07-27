import ApiCommand from '../../api-command';
import { mapValues as _mapValues } from 'lodash';

export default class AuthMe extends ApiCommand {
    static description = `Show currently authenticated user.

Retrieve metadata for the currently authenticated ListenFirst
platform user and associated, active ListenFirst Account`;

    static flags = {
        ...ApiCommand.flags,
    };

    async run() {
        const res = await this.fetch(
            `/v20200626/me`,
            undefined,
            `fetching current user`
        );

        let cols = {};
        if (res.record) {
            cols = _mapValues(res.record, () => {
                return {};
            });
        }

        this.outputRecords(res, cols);
    }
}
