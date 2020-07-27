import { flags } from '@oclif/command';
import BaseCommand from '../../base-command';
import { obtainAccessToken } from '../../lfapi/auth';
import cli from 'cli-ux';

export default class AuthToken extends BaseCommand {
    static description = `Obtain an access token

This command provides the ability to obtain an access
token via the OAuth 2.0 client credentials workflow.  
The process authenticates using the Client ID and 
Client Secret found in the lf-cli configuration profile.
The access token will be written to stdout.`;

    static examples = ['$ lf-cli auth', '$ lf-cli auth > access-token.json'];

    static flags = {
        help: flags.help({ char: 'h' }),
        ...BaseCommand.flags,
    };

    async run() {
        const profile = await this.lfapiConfigProfile();
        cli.action.start('obtaining access token');
        const token = await obtainAccessToken(profile);
        cli.action.stop();
        this.log(JSON.stringify(token, null, 2));
    }
}
