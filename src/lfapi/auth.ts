import fetch from 'node-fetch';

import * as querystring from 'querystring';
import { ProfileSettings } from './config';
import { AccessToken } from './types';

export class AuthError extends Error {
    public readonly statusCode: number;

    public readonly details?: any;

    constructor(message: string, statusCode: number, details: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

export async function obtainAccessToken(
    profile: ProfileSettings
): Promise<AccessToken> {
    const authUrl = new URL('/oauth2/token', `https://${profile.auth_host}`);
    // prepare the post data
    const authData = querystring.stringify({
        client_id: profile.client_id,
        client_secret: profile.client_secret,
        grant_type: 'client_credentials',
        scope: 'api/basic',
    });

    // prepare the POST request
    const authReqOpts = {
        method: 'POST',
        body: authData,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': Buffer.byteLength(authData).toString(),
        },
    };

    const res = await fetch(authUrl, authReqOpts);
    const data = await res.json();

    if (res.ok) {
        if (data && data.access_token) {
            return data as AccessToken;
        }
        throw new AuthError('Invalid token response', res.status, data);
    }
    throw new AuthError('Failed to obtain access token', res.status, data);
}
