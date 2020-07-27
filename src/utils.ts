import * as readline from 'readline';
import {
    split as _split,
    capitalize as _capitalize,
    join as _join,
    map as _map,
} from 'lodash';

export async function parseStdin(): Promise<any> {
    return new Promise((resolve) => {
        const rl = readline.createInterface(process.stdin);
        let data = '';
        rl.on('line', (l) => {
            data += l;
        });
        rl.on('close', () => {
            resolve(JSON.parse(data));
        });
    });
}

export function titlecase(str?: string): string | undefined {
    if (str) {
        const parts = _split(str, /\s+/);
        return _join(_map(parts, _capitalize), ' ');
    }
}

export function normTitlecase(str?: string): string | undefined {
    if (str) {
        return titlecase(str.replace(/(\W|_)+/i, ' '));
    }
}
