import BaseCommand from '../../base-command';

export default class ConfigList extends BaseCommand {
    static description = 'List configuration profiles';

    static flags = {
        ...BaseCommand.flags,
    };

    static examples = ['$ lf-cli config:list'];

    async run() {
        await this.parse(ConfigList);
        const config = await this.lfapiConfig();
        if (config.hasProfiles()) {
            config.eachProfile((p) => {
                this.log(JSON.stringify(p, null, 2));
            });
        } else {
            this.log('No profiles configured.  Run `lf-cli config:create`');
        }
    }
}
