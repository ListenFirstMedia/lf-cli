import { AccessToken } from './types';
import { ProfileSettings } from './config';
import _fetch from 'node-fetch';
import { merge as _merge, join as _join } from 'lodash';

export class ClientError extends Error {}

export class ClientFetchError extends ClientError {
    public readonly statusCode: number;

    public readonly details?: any;

    constructor(message: string, statusCode: number, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

export default class Client {
    public access_token: AccessToken;

    public user_agent?: string;

    #profile: ProfileSettings;

    constructor(tok: AccessToken, profile: ProfileSettings) {
        this.access_token = tok;
        this.#profile = profile;
    }

    async getApiUrl(relPath: string, profileHost: string) {
        let httpProtocol = 'https';
        if (/localhost/.test(profileHost)) {
            httpProtocol = 'http';
        }

        return new URL(relPath, `${httpProtocol}://${this.#profile.api_host}`);
    }

    async asCurl(relPath: string, opts: RequestInit = {}): Promise<string> {
        const method = opts?.method || 'GET';
        const fqUrl = await this.getApiUrl(relPath, this.#profile.api_host);
        const cmd = [
            'curl',
            '--http1.1',
            '-H "Content-Type: application/json"',
            `-H "X-API-KEY: ${this.#profile.api_key}"`,
            `-H "Authorization: Bearer ${this.access_token.access_token}"`,
            `-X ${method.toUpperCase()}`,
        ];

        if (this.#profile.account_id) {
            cmd.push(`-H "LFM-ACTING-ACCOUNT: ${this.#profile.account_id}"`);
        }

        if (opts?.body) {
            cmd.push(`-d '${opts.body}'`);
        }

        cmd.push(fqUrl.toString());

        return _join(cmd, ' ');
    }

    async fetch(relPath: string, opts: RequestInit = {}): Promise<any> {
        const defaultOpts: {
            headers: {
                'content-type': string;
                authorization: string;
                'x-api-key': string;
                'User-Agent'?: string;
                'lf-cli-version'?: string;
                'lfm-acting-account'?: string;
                'lf-client-library'?: string;
                'lf-client-version': string;
            };
        } = {
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${this.access_token.access_token}`,
                'x-api-key': this.#profile.api_key,
                'User-Agent': this.user_agent,
                'lf-cli-version': '',
                'lfm-acting-account': '',
                'lf-client-library': 'lf-cli',
                'lf-client-version': '',
            },
        };

        if (this.#profile.account_id) {
            let actAsAccount = '';
            actAsAccount = this.#profile.account_id.toString();
            defaultOpts.headers['lfm-acting-account'] = actAsAccount;
        } else {
            delete defaultOpts.headers['lfm-acting-account'];
        }

        if (this.user_agent === undefined) {
            delete defaultOpts.headers['User-Agent'];
            delete defaultOpts.headers['lf-cli-version'];
        } else {
            const rx = new RegExp(/^@listenfirst\/lf-cli\/([\d.]+)/);
            const rxRes = rx.exec(this.user_agent);
            if (rxRes === null) {
                delete defaultOpts.headers['lf-cli-version'];
            } else {
                const cli_version = rxRes[0].split('/')[2];
                defaultOpts.headers['lf-cli-version'] = cli_version;
                defaultOpts.headers['lf-client-version'] = cli_version;
            }
        }

        const fetchOpts = _merge({}, defaultOpts, opts);

        const fqUrl = await this.getApiUrl(relPath, this.#profile.api_host);
        const res = await _fetch(fqUrl.toString(), fetchOpts as any);
        const data = await res.json();
        if (res.ok) {
            return data;
        }

        if (res.status === 429) {
            // sleep and retry
            await new Promise((resolve) => {
                setTimeout(resolve, 60_000);
            });
            return this.fetch(relPath, opts);
        }

        throw new ClientFetchError('API request failed', res.status, data);
    }
}
