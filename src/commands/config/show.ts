import { Command, flags } from '@oclif/command';
import { profileFlag } from '../../cli-flags';

export default class ConfigShow extends Command {
    static description = 'Show the configuration profile';

    static flags = {
        help: flags.help({ char: 'h' }),
        profile: profileFlag(),
    };

    async run() {
        const opts = this.parse(ConfigShow);
        this.log(`showing configuration profile: ${opts.flags.profile}`);
    }
}
