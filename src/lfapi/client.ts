import { AccessToken } from './auth';
import { ProfileSettings } from './config';
import _fetch from 'node-fetch';
import * as _ from 'lodash';

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

    async fetch(relPath: string, opts = {}): Promise<any> {
        const defaultOpts = {
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${this.access_token.access_token}`,
                'x-api-key': this.#profile.api_key,
                'lfm-acting-account': '',
            },
        };

        if (this.#profile.account_id) {
            defaultOpts.headers[
                'lfm-acting-account'
            ] = this.#profile.account_id.toString();
        } else {
            delete defaultOpts.headers['lfm-acting-account'];
        }

        const fetchOpts = _.merge({}, opts, defaultOpts);

        const fqUrl = new URL(relPath, `https://${this.#profile.api_host}`);
        const res = await _fetch(fqUrl.toString(), fetchOpts);
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
