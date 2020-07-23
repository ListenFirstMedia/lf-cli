import { flags } from '@oclif/command';
import BaseCommand from '../../base-command';
import { obtainAccessToken } from '../../lfapi/auth';

export default class AuthIndex extends BaseCommand {
    static description =
        'Use client credentials to authenticate and obtain an access token';

    static flags = {
        help: flags.help({ char: 'h' }),
        ...BaseCommand.flags,
    };

    async run() {
        const profile = await this.lfapiConfigProfile();
        const token = await obtainAccessToken(profile);
        this.log(JSON.stringify(token, null, 2));
    }
}
