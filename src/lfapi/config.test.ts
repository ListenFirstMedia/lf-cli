import { Config } from './config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('lfapi config', () => {
    test('can save and load config', async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-cli-'));
        const fn = path.join(tmpDir, 'test.toml');
        const config = new Config(fn);

        config.addProfile('test1', true, {
            api_key: 'api_key1',
            client_id: 'client_id1',
            client_secret: 'client_secret1',
            api_host: 'api_host1',
            auth_host: 'auth_host1',
        });

        config.addProfile('test2', false, {
            api_key: 'api_key2',
            client_id: 'client_id2',
            client_secret: 'client_secret2',
            api_host: 'api_host2',
            auth_host: 'auth_host2',
            account_id: 2,
        });

        expect(fs.existsSync(fn)).toBeFalsy();
        await config.save();

        const stat = fs.statSync(fn);
        expect(fs.existsSync(fn)).toBeTruthy();
        expect(stat.size).toBeGreaterThan(0);

        const config2 = new Config(fn);
        await config2.reload();

        const tc1 = config2.getProfile('test1');
        expect(tc1).toBeTruthy();
        if (tc1 !== undefined) {
            expect(tc1.api_key).toEqual('api_key1');
            expect(tc1.name).toEqual('test1');
            expect(tc1?.is_default).toEqual(true);
            expect(tc1.account_id).toBeUndefined();
        }

        expect(config2.getProfile('test2')?.account_id).toEqual(2);
        const dtc = config2.getDefaultProfile();
        expect(dtc).toBeTruthy();
        if (dtc !== undefined) {
            expect(dtc.name).toEqual('test1');
        }

        let cnt = 0;
        config2.eachProfile((p, i) => {
            expect(p.name).toBeTruthy();
            expect(i).toBeGreaterThanOrEqual(0);
            cnt += 1;
        });
        expect(cnt).toEqual(2);
    });
});
