import { flags } from '@oclif/command';
import BaseCommand from './base-command';
import cli, { Table } from 'cli-ux';
import * as _ from 'lodash';
import Client, { ClientFetchError } from './lfapi/client';
import { obtainAccessToken } from './lfapi/auth';
import * as querystring from 'querystring';

export interface RecordsResponse {
    records: Array<any>;
    page?: number;
}

export interface TableResponseColumn {
    id: string;
    name: string;
    class: string;
    data_type: string;
}

export interface TableResponse {
    columns: Array<TableResponseColumn>;
    records: Array<any>;
    page: number;
    has_more_pages?: boolean;
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
        if (!this.silent()) {
            cli.action.start(actionMsg || 'fetching');
        }
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

        let currentPage = 1;

        // extract current page from query arameters
        let queryArgs: any = {};
        let path = relPath;
        let queryStr = '';
        if (relPath.includes('?')) {
            const idx = relPath.indexOf('?');
            queryStr = relPath.substr(idx + 1);
            path = relPath.substr(0, idx);

            if (queryStr.length > 0) {
                queryArgs = querystring.parse(queryStr);
            }
        }

        if (queryArgs.page) {
            currentPage = Number(queryArgs.page);
        }

        // extract current page from post body
        let isPost = false;
        let bodyData: any = {};
        if (fetchOpts && fetchOpts.method && /post/i.test(fetchOpts.method)) {
            isPost = true;
            if (fetchOpts.body) {
                bodyData = JSON.parse(fetchOpts.body);
                if (bodyData.page) {
                    currentPage = Number(bodyData.page);
                }
            }
        }

        const fetchPath = `${path}?${querystring.stringify(queryArgs)}`;
        const msgPrefix = actionMsg || 'fetching';
        const fetchActionMsg = `${msgPrefix} (page ${currentPage})`;

        const res = await this.fetch(fetchPath, fetchOpts, fetchActionMsg);
        pageCB(res);

        // handle next page
        const belowPageLimit = maxPage < 0 || maxPage > currentPage;
        if (res.has_more_pages === true && belowPageLimit === true) {
            const nextPage = currentPage + 1;
            if (isPost) {
                delete queryArgs.page;
                bodyData.page = nextPage;
                fetchOpts.body = JSON.stringify(bodyData);
            } else {
                queryArgs.page = nextPage;
            }
            const nextPath = `${path}?${querystring.stringify(queryArgs)}`;
            return this.fetchAllPages(
                { relPath: nextPath, fetchOpts, actionMsg },
                maxPage,
                pageCB
            );
        }
        return true;
    }

    outputRecords(
        res: RecordsResponse | RecordResponse | TableResponse,
        cols: Table.table.Columns<any>
    ): void {
        const apiFlags = this.parsedApiFlags();

        let unwrappedRecords: Array<any>;
        if ('records' in res) {
            unwrappedRecords = res.records;
        } else {
            unwrappedRecords = [res.record];
        }

        const tableOpts = _.pick(apiFlags as any, _.keys(cli.table.flags()));
        switch (apiFlags.format) {
            case 'raw':
                if (apiFlags.pretty) {
                    this.pp(res);
                } else {
                    this.log(JSON.stringify(res));
                }
                break;
            case 'doc':
                if ('columns' in res) {
                    const keys = _.map(res.columns, (val) => val.id);
                    unwrappedRecords = _.map(res.records, (row) => {
                        return _.zipObject(keys, row);
                    });
                }
                if (apiFlags.pretty) {
                    unwrappedRecords.forEach((rec: any) => this.pp(rec));
                } else {
                    unwrappedRecords.forEach((rec: any) =>
                        this.log(JSON.stringify(rec))
                    );
                }
                break;
            case 'table':
                if ('page' in res && res.page && res.page > 1) {
                    tableOpts['no-header'] = true;
                }
                cli.table(unwrappedRecords, cols, {
                    printLine: this.log,
                    ...tableOpts,
                });
                break;
            default:
                this.error('Unexpected output format');
                this.exit(1);
        }
    }
}
