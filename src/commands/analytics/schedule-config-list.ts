import ApiCommand from '../../api-command';

export default class ScheduleConfigList extends ApiCommand {
    static description = `Return schedule configs submitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static examples = ['$ lf-cli analytics:schedule-config-list'];

    async run() {
        const path = `/v20200626/analytics/schedule_config`;
        const res = await this.fetch(path, undefined, `fetching`);
        let cols = {};
        cols = {
            id: {},
            state: {},
            created_at: {},
            updated_at: {},
        };

        this.outputRecords(res, cols);
    }
}
