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

    #profile: ProfileSettings;

    constructor(tok: AccessToken, profile: ProfileSettings) {
        this.access_token = tok;
        this.#profile = profile;
    }

    async asCurl(relPath: string, opts: RequestInit = {}): Promise<string> {
        const method = opts?.method || 'GET';
        const fqUrl = new URL(relPath, `https://${this.#profile.api_host}`);
        const cmd = [
            'curl',
            '--http1.1',
            '-H "Content-Type: application/json"',
            `-H "X-API-KEY: ${this.#profile.api_key}"`,
            `-H "Authorization: Bearer ${this.access_token.access_token}"`,
            `-X ${method.toUpperCase()}`,
        ];

        if (this.#profile.account_id) {
            cmd.push(`-H "LF-ACTING-ACCOUNT: ${this.#profile.account_id}"`);
        }

        if (opts?.body) {
            cmd.push(`-d '${opts.body}'`);
        }

        cmd.push(fqUrl.toString());

        return _join(cmd, ' ');
    }

    async fetch(relPath: string, opts: RequestInit = {}): Promise<any> {
        let actAsAccount = '';
        if (this.#profile.account_id) {
            actAsAccount = this.#profile.account_id.toString();
        }

        const defaultOpts = {
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${this.access_token.access_token}`,
                'x-api-key': this.#profile.api_key,
                'lfm-acting-account': actAsAccount,
            },
        };

        const fetchOpts = _merge({}, opts, defaultOpts);

        const fqUrl = new URL(relPath, `https://${this.#profile.api_host}`);
        const res = await _fetch(fqUrl.toString(), fetchOpts as any);
        const data = await res.json();
        if (res.ok) {
            return data;
        }
        if (res.status === 429) {
            // sleep and retry
            await new Promise((resolve) => setTimeout(resolve, 60000));
            return this.fetch(relPath, opts);
        }

        throw new ClientFetchError('API request failed', res.status, data);
    }
}
