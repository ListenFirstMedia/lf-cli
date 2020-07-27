import BaseCommand from '../../base-command';
import * as Listr from 'listr';
import { obtainAccessToken } from '../../lfapi/auth';
import Client from '../../lfapi/client';

export default class ConfigVerify extends BaseCommand {
    static description = 'Verify the profile';

    static flags = {
        ...BaseCommand.flags,
    };

    async run() {
        this.log(`Verifying configuration profile`);

        const tasks = new Listr([
            {
                title: 'Loading profile settings',
                task: async (ctx) => {
                    const profile = await this.lfapiConfigProfile();
                    ctx.profile = profile;
                    return profile;
                },
            },
            {
                title: 'Obtaining access token',
                enabled: (ctx) => ctx.profile !== undefined,
                task: async (ctx) => {
                    const token = await obtainAccessToken(ctx.profile);
                    ctx.token = token;
                    return token;
                },
            },
            {
                title: 'Making a secure request',
                enabled: (ctx) => ctx.token !== undefined,
                task: async (ctx) => {
                    const client = new Client(ctx.token, ctx.profile);
                    const res = await client.fetch('/v20200626/brand_views');
                    if (res && res.records && res.records.length > 0) {
                        return true;
                    }
                    throw new Error('Failed to make a secure request');
                },
            },
        ]);

        await tasks.run();
    }
}
