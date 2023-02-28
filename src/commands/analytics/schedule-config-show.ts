import ApiCommand from '../../api-command';

export default class ScheduleConfigShow extends ApiCommand {
    static description = `Return a schedule config submitted by the user.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static args = [
        {
            name: 'ID',
            description: 'the ID of the schedule config to retrieve',
            required: true,
        },
    ];

    static examples = ['$ lf-cli analytics:schedule-config-show 42'];

    async run() {
        const opts = this.parse(ScheduleConfigShow);

        if (!opts.args.ID.match(/^[\d]+$/i)) {
            this.error('Invalid Schedule Config ID', { exit: 1 });
        }

        const path = `/v20200626/analytics/schedule_config/${opts.args.ID}`;
        const res = await this.fetch(
            path,
            undefined,
            `Fetching schedule config ${opts.args.ID}.`
        );
        let cols = {};
        cols = {
            id: {},
            state: {},
        };

        this.outputRecords(res, cols);
    }
}
