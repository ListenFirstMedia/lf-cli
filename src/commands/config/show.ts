import BaseCommand from '../../base-command';

export default class ConfigShow extends BaseCommand {
    static description = 'Show the configuration profile';

    static flags = {
        ...BaseCommand.flags,
    };

    async run() {
        const profile = await this.lfapiConfigProfile();
        this.log(JSON.stringify(profile, null, 2));
    }
}
