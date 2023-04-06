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

    static examples = [
        '$ lf-cli auth:token',
        '$ lf-cli auth:token >| access-token.json',
    ];

    static flags = {
        ...BaseCommand.flags,
    };

    async run() {
        const profile = await this.lfapiConfigProfile();
        if (!this.silent()) {
            cli.action.start('obtaining access token');
        }

        const token = await obtainAccessToken(profile);
        cli.action.stop();
        this.log(JSON.stringify(token, null, 2));
    }
}
