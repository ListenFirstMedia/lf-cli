import { flags } from '@oclif/command';
import BaseCommand from '../../base-command';

export default class ConfigShow extends BaseCommand {
    static description = 'Show the configuration profile';

    static flags = {
        help: flags.help({ char: 'h' }),
        ...BaseCommand.flags,
    };

    async run() {
        const profile = await this.lfapiConfigProfile();
        this.log(JSON.stringify(profile, null, 2));
    }
}
