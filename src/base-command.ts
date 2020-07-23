import { Command } from '@oclif/command';
import { Config, Profile } from './lfapi/config';
import * as path from 'path';
import { profileFlag } from './cli-flags';

export default abstract class BaseCommand extends Command {
    static flags = {
        profile: profileFlag(),
    };

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
        const opts = this.parse(BaseCommand);

        let profile;
        if (opts.flags.profile === undefined) {
            profile = cfg.getDefaultProfile();
        } else {
            profile = cfg.getProfile(opts.flags.profile);
        }

        if (profile === undefined) {
            throw new Error('Configuration profile does not exist');
        }
        return profile;
    }
}
