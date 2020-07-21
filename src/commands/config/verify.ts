import { Command, flags } from '@oclif/command';
import { profileFlag } from '../../cli-flags';

export default class ConfigVerify extends Command {
    static description = 'Verify the profile';

    static flags = {
        help: flags.help({ char: 'h' }),
        profile: profileFlag(),
    };

    async run() {
        const opts = this.parse(ConfigVerify);
        this.log(`verifying ${opts.flags.profile}`);
    }
}
