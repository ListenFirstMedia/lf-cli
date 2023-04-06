import * as fs from 'node:fs';
import * as TOML from '@iarna/toml';
import * as _ from 'lodash';
import * as path from 'node:path';

export interface ProfileSettings {
    api_key: string;
    client_id: string;
    client_secret: string;
    api_host: string;
    auth_host: string;
    account_id?: number;
}

export interface Profile extends ProfileSettings {
    name: string;
    is_default: boolean;
}

interface ConfigData {
    [index: string]: ProfileSettings | undefined | string;
    default?: string;
}

export class Config {
    readonly fn: string;

    #profiles: Array<Profile>;

    constructor(fn: string) {
        this.fn = fn;
        this.#profiles = [];
    }

    async reload(): Promise<boolean> {
        this.#profiles.splice(0, this.#profiles.length);

        if (fs.existsSync(this.fn)) {
            const contents = await fs.promises.readFile(this.fn);
            const cfg = TOML.parse(contents.toString()) as ConfigData;
            _.each(cfg, (val, key) => {
                if (key !== 'default') {
                    this.#profiles.push({
                        name: key,
                        is_default: key === cfg.default,
                        ...(val as ProfileSettings),
                    });
                }
            });
        }

        return true;
    }

    async save(): Promise<boolean> {
        const dirname = path.dirname(this.fn);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        const cfg = { default: undefined } as any;
        _.each(this.#profiles, (p: Profile) => {
            cfg[p.name] = {
                api_key: p.api_key,
                client_id: p.client_id,
                client_secret: p.client_secret,
                api_host: p.api_host,
                auth_host: p.auth_host,
            };
            if (p.account_id) {
                cfg[p.name].account_id = p.account_id;
            }

            if (p.is_default) {
                cfg.default = p.name;
            }
        });

        await fs.promises.writeFile(this.fn, TOML.stringify(cfg));

        return true;
    }

    hasProfiles(): boolean {
        return this.#profiles.length > 0;
    }

    addProfile(
        name: string,
        is_default: boolean,
        settings: ProfileSettings
    ): void {
        const allSettings = _.assign(
            {},
            {
                api_host: 'listenfirst.io',
                auth_host: 'auth.listenfirstmedia.com',
            },
            settings
        );

        const p: Profile = {
            name,
            is_default: is_default || !this.hasProfiles(),
            ...allSettings,
        };

        this.#profiles.push(p);
    }

    getProfile(name: string): Profile | undefined {
        return _.find(this.#profiles, (p: Profile) => p.name === name);
    }

    getDefaultProfile(): Profile | undefined {
        return _.find(this.#profiles, (p: Profile) => p.is_default);
    }

    eachProfile(cb: (p: Profile, idx: number) => void): void {
        for (const [idx, p] of this.#profiles.entries()) {
            cb(p, idx);
        }
    }
}
