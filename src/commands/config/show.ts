import BaseCommand from '../../base-command';

export default class ConfigShow extends BaseCommand {
    static description = 'Show the configuration profile';

    static flags = {
        ...BaseCommand.flags,
    };

    static examples = [
        '$ lf-cli config:show',
        '$ lf-cli config:show -p my-other-profile',
    ];

    async run() {
        await this.parse(ConfigShow);
        const profile = await this.lfapiConfigProfile();
        this.log(JSON.stringify(profile, null, 2));
    }
}
