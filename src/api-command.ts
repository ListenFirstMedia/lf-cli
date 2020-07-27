import { flags } from '@oclif/command';
import BaseCommand from './base-command';
import cli, { Table } from 'cli-ux';
import * as _ from 'lodash';
import Client, { ClientFetchError } from './lfapi/client';
import { obtainAccessToken } from './lfapi/auth';
import * as querystring from 'querystring';

export interface RecordsResponse {
    records: Array<any>;
}

export interface RecordResponse {
    record: any;
}

export interface FetchParams {
    relPath: string;
    fetchOpts?: any;
    actionMsg?: string;
}

export default abstract class ApiCommand extends BaseCommand {
    async catch(error: any) {
        if (error instanceof ClientFetchError) {
            this.warn('API request failed');
            this.warn(`API status code: ${error.statusCode}`);
            this.warn(JSON.stringify(error.details, null, 2));
        }

        throw error;
    }

    static flags = {
        format: flags.string({
            description: 'output format of the results',
            default: 'raw',
            options: ['raw', 'table', 'doc'],
        }),
        pretty: flags.boolean({
            description:
                'pretty print json responses (applies to raw or doc formats)',
            default: false,
        }),
        ...BaseCommand.flags,
        ...cli.table.flags({
            except: ['extended', 'output', 'filter', 'sort'],
        }),
    };

    parsedApiFlags(): flags.Output {
        // a bit of typescript gynmnastics with static flags
        const opts = this.parse(
            (this.constructor as unknown) as flags.Input<any>
        );
        const flags = opts.flags as flags.Output;
        return flags;
    }

    async lfmapClient(): Promise<Client> {
        const profile = await this.lfapiConfigProfile();
        const token = await obtainAccessToken(profile);
        const client = new Client(token, profile);
        return client;
    }

    async fetch(
        relPath: string,
        fetchOpts?: any,
        actionMsg?: string
    ): Promise<any> {
        const client = await this.lfmapClient();
        cli.action.start(actionMsg || 'fetching');
        const res = await client.fetch(relPath, fetchOpts);
        cli.action.stop();
        return res;
    }

    async fetchAllPages(
        fetchParams: FetchParams,
        maxPage: number,
        pageCB: (res: any) => void
    ): Promise<boolean> {
        const { relPath, fetchOpts, actionMsg } = fetchParams;
        let args: any = {};
        let path = relPath;
        let queryStr = '';
        if (relPath.includes('?')) {
            const idx = relPath.indexOf('?');
            queryStr = relPath.substr(idx + 1);
            path = relPath.substr(0, idx);

            if (queryStr.length > 0) {
                args = querystring.parse(queryStr);
            }
        }

        if (args.page === undefined) {
            args.page = 1;
        }

        const fetchPath = `${path}?${querystring.stringify(args)}`;

        const fetchActionMsg = `${actionMsg || 'fetching'} (page ${args.page})`;
        const res = await this.fetch(fetchPath, fetchOpts, fetchActionMsg);
        pageCB(res);
        const belowPageLimit = maxPage < 0 || maxPage > Number(args.page);
        if (res.has_more_pages === true && belowPageLimit === true) {
            args.page = Number(args.page) + 1;
            const nextPath = `${path}?${querystring.stringify(args)}`;
            return this.fetchAllPages(
                { relPath: nextPath, fetchOpts, actionMsg },
                maxPage,
                pageCB
            );
        }
        return true;
    }

    outputRecords(
        res: RecordsResponse | RecordResponse,
        cols: Table.table.Columns<any>
    ): void {
        const apiFlags = this.parsedApiFlags();

        let unwrappedRecords: Array<any>;
        if ('records' in res) {
            unwrappedRecords = res.records;
        } else {
            unwrappedRecords = [res.record];
        }

        switch (apiFlags.format) {
            case 'raw':
                if (apiFlags.pretty) {
                    this.pp(res);
                } else {
                    this.log(JSON.stringify(res));
                }
                break;
            case 'doc':
                if (apiFlags.pretty) {
                    unwrappedRecords.forEach((rec: any) => this.pp(rec));
                } else {
                    unwrappedRecords.forEach((rec: any) =>
                        this.log(JSON.stringify(rec))
                    );
                }
                break;
            case 'table':
                cli.table(unwrappedRecords, cols, {
                    printLine: this.log,
                    ..._.pick(apiFlags as any, _.keys(cli.table.flags())),
                });
                break;
            default:
                this.error('Unexpected output format');
                this.exit(1);
        }
    }
}
