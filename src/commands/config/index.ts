import { Command, flags } from '@oclif/command';
import { Config } from '../../lfapi/config';
import * as path from 'path';

export default class ConfigIndex extends Command {
    static aliases = ['config:index', 'config:list'];

    static description = 'List configuration profiles';

    static flags = {
        help: flags.help({ char: 'h' }),
    };

    async run() {
        const configFn = path.join(this.config.configDir, 'profiles.toml');
        const config = new Config(configFn);
        await config.reload();
        if (config.hasProfiles()) {
            config.eachProfile((p) => {
                this.log(JSON.stringify(p, null, 2));
            });
        } else {
            this.log('No profiles configured');
        }
    }
}
