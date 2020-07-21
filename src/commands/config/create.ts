import { Command, flags } from '@oclif/command';
import { profileFlag } from '../../cli-flags';
import * as inquirer from 'inquirer';
import { Config } from '../../lfapi/config';
import * as path from 'path';

export default class ConfigCreate extends Command {
    static aliases = ['config:index', 'config:create'];

    static description = 'Create or update a configuration profile';

    static flags = {
        help: flags.help({ char: 'h' }),
        profile: profileFlag(),
    };

    async run() {
        const opts = this.parse(ConfigCreate);

        const configFn = path.join(this.config.configDir, 'profiles.toml');
        const config = new Config(configFn);
        await config.reload();

        const questions = [
            {
                type: 'input',
                name: 'profile',
                message: 'Profile Name',
                default: opts.flags.profile,
                validate: async (str: string) => {
                    if (str.match(/^[\w_-]+$/i)) {
                        return true;
                    }
                    return 'Profile names must only alphanumeric characters, dashes or underscores';
                },
            },
            {
                type: 'input',
                name: 'api_key',
                message: 'API Key',
                validate: async (str: string) => {
                    if (str.match(/^[\w]+$/i) && str.length === 40) {
                        return true;
                    }
                    return 'Invalid API Key';
                },
            },
            {
                type: 'input',
                name: 'client_id',
                message: 'Client ID',
                validate: async (str: string) => {
                    if (str.match(/^[\w]+$/i) && str.length === 26) {
                        return true;
                    }
                    return 'Invalid Client ID';
                },
            },
            {
                type: 'password',
                name: 'client_secret',
                message: 'Client Secret',
                validate: async (str: string) => {
                    if (str.match(/^[\w]+$/i) && str.length > 50) {
                        return true;
                    }
                    return 'Invalid Client Secret';
                },
            },
            {
                type: 'confirm',
                name: 'show_advanced',
                message: 'Show advanced options?',
                default: false,
            },
            {
                type: 'input',
                name: 'api_host',
                message: 'API Host',
                default: 'listenfirst.io',
                when: (answers: any) => answers.show_advanced,
            },
            {
                type: 'input',
                name: 'auth_host',
                message: 'Auth Host',
                default: 'auth.listenfirstmedia.com',
                when: (answers: any) => answers.show_advanced,
            },
            {
                type: 'input',
                name: 'account_id',
                message: 'ListenFirst Account ID',
                when: (answers: any) => answers.show_advanced,
            },
            {
                type: 'confirm',
                name: 'make_default',
                message: 'Make this the default profile?',
                default: !config.hasProfiles(),
                when: () => config.hasProfiles(),
            },
        ];
        const answers = await inquirer.prompt(questions);

        if (answers.make_default) {
            config.eachProfile((p) => {
                p.is_default = false;
            });
        }
        config.addProfile(answers.profile, answers.make_default, answers);
        await config.save();
        this.log(`wrote ${answers.profile} profile to: ${configFn}`);
    }
}
