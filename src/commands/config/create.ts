import BaseCommand from '../../base-command';
import * as inquirer from 'inquirer';

export default class ConfigCreate extends BaseCommand {
    static description = 'Create or update a configuration profile';

    static flags = {
        ...BaseCommand.flags,
    };

    async run() {
        const opts = this.parse(ConfigCreate);
        const config = await this.lfapiConfig();
        const questions = [
            {
                type: 'input',
                name: 'profile',
                message: 'Profile Name',
                default: () => opts.flags.profile,
                validate: async (str: string) => {
                    if (str.match(/^[\w_-]+$/i)) {
                        return true;
                    }
                    return 'Profile names are required and must only alphanumeric characters, dashes or underscores';
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
        this.log(`wrote ${answers.profile} profile to: ${this.lfapiConfgFn}`);
    }
}
