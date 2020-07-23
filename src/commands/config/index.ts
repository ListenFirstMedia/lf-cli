import { flags } from '@oclif/command';
import BaseCommand from '../../base-command';

export default class ConfigIndex extends BaseCommand {
    static aliases = ['config:index', 'config:list'];

    static description = 'List configuration profiles';

    static flags = {
        help: flags.help({ char: 'h' }),
        ...BaseCommand.flags,
    };

    async run() {
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
