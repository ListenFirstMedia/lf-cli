import { Command, flags } from '@oclif/command';
import { Config, Profile } from './lfapi/config';
import * as path from 'path';

export default abstract class BaseCommand extends Command {
    static flags = {
        help: flags.help({ char: 'h' }),
        profile: flags.string({
            char: 'p',
            description: 'the name of the configuration profile',
            env: 'LF_ClI_API_PROFILE',
        }),
        'account-id': flags.string({
            char: 'A',
            description: 'switch accounts (overrides profile setting)',
            env: 'LF_CLI_ACCOUNT_ID',
        }),
        silent: flags.boolean({
            description: 'hide spinners and other log output',
        }),
    };

    parsedGlobalFlags(): flags.Output {
        // a bit of typescript gynmnastics with static flags
        const opts = this.parse(
            (this.constructor as unknown) as flags.Input<any>
        );
        const flags = opts.flags as flags.Output;
        return flags;
    }

    lfapiConfgFn(): string {
        return path.join(this.config.configDir, 'profiles.toml');
    }

    async lfapiConfig(): Promise<Config> {
        const config = new Config(this.lfapiConfgFn());
        await config.reload();
        return config;
    }

    async lfapiConfigProfile(): Promise<Profile> {
        const cfg = await this.lfapiConfig();
        const flags = this.parsedGlobalFlags();
        let profile;
        if (flags.profile === undefined) {
            profile = cfg.getDefaultProfile();
        } else {
            profile = cfg.getProfile(flags.profile);
        }

        if (profile === undefined) {
            throw new Error('Configuration profile does not exist');
        }

        if (flags['account-id']) {
            profile.account_id = Number(flags['account-id']);
        }

        return profile;
    }

    silent(): boolean {
        return this.parsedGlobalFlags().silent;
    }

    pp(data: any): void {
        this.log(JSON.stringify(data, null, 2));
    }
}
