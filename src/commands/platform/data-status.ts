import ApiCommand from '../../api-command';

export default class DataStatus extends ApiCommand {
    static description = `Get data status`;

    static examples = ['$ lf-cli platform:data-status'];

    async run() {
        const path = `/v20200626/platform/data_status`;
        const res = await this.fetch(path, undefined, `fetching data_status`);
        const apiFlags = this.parsedApiFlags();
        if (apiFlags.pretty) {
            this.pp(res);
        } else {
            this.log(JSON.stringify(res));
        }
    }
}
