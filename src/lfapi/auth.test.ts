import { obtainAccessToken, AuthError } from './auth';
import { ProfileSettings } from './config';
import * as _ from 'lodash';

const LFM_API_CONFIG = {
    api_key: process.env.LFM_API_KEY,
    client_id: process.env.LFM_API_CLIENT_ID,
    client_secret: process.env.LFM_API_CLIENT_SECRET,
    auth_host: process.env.LFM_API_AUTH_HOST || 'auth.lfmdev.in',
    api_host: process.env.LFM_API_HOST || 'api.lfmdev.in',
};

describe('auth', () => {
    it('can obtain an access token', async () => {
        const tok = await obtainAccessToken(LFM_API_CONFIG as ProfileSettings);
        expect(tok).toBeTruthy();
        expect(tok.access_token).toBeTruthy();
        expect(tok.expires_in).toBeGreaterThanOrEqual(0);
        expect(tok.token_type).toBeTruthy();
    });

    it('fails to obtain an access token with invalid creds', async () => {
        const badCfg = _.merge({}, LFM_API_CONFIG, {
            client_secret: 'invalid-secret-key',
        });
        try {
            await obtainAccessToken(badCfg as ProfileSettings);
            fail('expected access token to throw an error');
        } catch (error) {
            if (error instanceof AuthError) {
                expect(error.statusCode).toBeGreaterThanOrEqual(0);
                expect(error.statusCode).not.toEqual(200);
                expect(error.details).toBeTruthy();
                expect(error.message).toBeTruthy();
            } else {
                fail('unexpected error thrown');
            }
        }
    });
});
