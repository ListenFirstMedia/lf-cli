import { flags } from '@oclif/command';
import BaseCommand from './base-command';
import cli, { Table } from 'cli-ux';
import * as _ from 'lodash';
import { ClientFetchError } from './lfapi/client';
import * as querystring from 'node:querystring';
import { format, FormatterOptions } from '@fast-csv/format';

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
            options: ['raw', 'table', 'doc', 'csv', 'tsv'],
        }),
        csv: flags.boolean({
            description: 'shorthand for --format csv',
            default: false,
        }),
        pretty: flags.boolean({
            description:
                'pretty print json responses (applies to raw or doc formats)',
            default: false,
        }),
        'show-curl': flags.boolean({
            description: 'instead of making the request, print a curl command',
            default: false,
        }),
        ...BaseCommand.flags,
        ...cli.table.flags({
            except: ['extended', 'output', 'filter', 'sort', 'csv'],
        }),
    };

    parsedApiFlags(): flags.Output {
        // a bit of typescript gynmnastics with static flags
        const opts = this.parse(
            this.constructor as unknown as flags.Input<any>
        );
        const flags = opts.flags as flags.Output;
        if (flags.csv === true) {
            flags.format = 'csv';
        }

        return flags;
    }

    async fetch(
        relPath: string,
        fetchOpts?: any,
        actionMsg?: string
    ): Promise<any> {
        const client = await this.lfapiClient();

        if (this.parsedApiFlags()['show-curl']) {
            const curl = await client.asCurl(relPath, fetchOpts);
            this.log(curl);
            this.exit(0);
        }

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
            queryStr = relPath.slice(idx + 1);
            path = relPath.slice(0, Math.max(0, idx));

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
        cols?: Table.table.Columns<any>
    ): void {
        cols = cols || {};

        const apiFlags = this.parsedApiFlags();

        let unwrappedRecords: Array<any>;
        unwrappedRecords = 'records' in res ? res.records : [res.record];

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
                    for (const rec of unwrappedRecords) {
                        this.pp(rec);
                    }
                } else {
                    for (const rec of unwrappedRecords) {
                        this.log(JSON.stringify(rec));
                    }
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
            case 'csv':
                this.outputCsv(res, cols, unwrappedRecords, ',');

                break;

            case 'tsv':
                this.outputCsv(res, cols, unwrappedRecords, '\t');

                break;
            default:
                this.error('Unexpected output format');
                this.exit(1);
        }
    }

    private outputCsv(
        res: RecordsResponse | RecordResponse | TableResponse,
        cols: Table.table.Columns<any>,
        unwrappedRecords: any[],
        delimiter: string
    ) {
        const tableOpts = _.pick(
            this.parsedApiFlags() as any,
            _.keys(cli.table.flags())
        );

        if ('page' in res && res.page && res.page > 1) {
            tableOpts['no-header'] = true;
        }

        let csvOpts = new FormatterOptions({
            headers: false,
            includeEndRowDelimiter: true,
            writeBOM: true,
            delimiter,
        });

        if (tableOpts['no-header'] !== true && cols !== undefined) {
            const headers = _.map(cols, (col, id) => {
                return col.header || id;
            });
            csvOpts = new FormatterOptions({
                headers: headers,
                alwaysWriteHeaders: true,
                includeEndRowDelimiter: true,
                writeBOM: true,
                delimiter,
            });
        }

        const csvStream = format(csvOpts);
        csvStream.pipe(process.stdout);
        for (const row of unwrappedRecords) {
            const cleanRow = _.map(row, (val) => {
                if (typeof val === 'string' || val instanceof String) {
                    return val.replace(/\n/gi, ' ');
                }

                return val;
            });
            csvStream.write(cleanRow);
        }

        csvStream.end();
    }
}
