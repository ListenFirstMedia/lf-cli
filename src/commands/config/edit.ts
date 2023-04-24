import BaseCommand from '../../base-command';
import * as child_process from 'node:child_process';
import { split as _split } from 'lodash';

export default class ConfigEdit extends BaseCommand {
    static description = 'Open the configuration profiles with system editor';

    static flags = {
        ...BaseCommand.flags,
    };

    static examples = [
        '$ lf-cli config:edit',
        '$ EDITOR=emacs lf-cli config:edit',
    ];

    async run() {
        this.parse(ConfigEdit);

        const fn = await this.lfapiConfgFn();
        let editor = process.env.EDITOR;
        if (editor === undefined) {
            editor = process.platform === 'win32' ? 'edit' : 'vi';
        }

        const cmd = [..._split(editor, /\s+/), fn];

        await new Promise<void>((resolve) => {
            const child = child_process.spawn(cmd[0], cmd.slice(1), {
                // detached: true,
                stdio: 'inherit',
            });
            child.on('close', (code) => {
                this.log('EDITOR closed: ' + code);
                resolve();
            });
        });
    }
}
