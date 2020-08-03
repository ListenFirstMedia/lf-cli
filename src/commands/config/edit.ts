import BaseCommand from '../../base-command';
import * as child_process from 'child_process';
import { split as _split } from 'lodash';

export default class ConfigShow extends BaseCommand {
    static description = 'Open the configuration profiles with system editor';

    static flags = {
        ...BaseCommand.flags,
    };

    async run() {
        const fn = await this.lfapiConfgFn();
        let editor = process.env.EDITOR;
        if (editor === undefined) {
            if (process.platform === 'win32') {
                editor = 'edit';
            } else {
                editor = 'vi';
            }
        }
        const cmd = _split(editor, /\s+/).concat(fn);

        await new Promise((resolve) => {
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
