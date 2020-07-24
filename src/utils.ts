import * as readline from 'readline';

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
