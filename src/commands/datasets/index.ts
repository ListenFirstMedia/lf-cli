import { flags } from '@oclif/command';
import BaseCommand from '../../base-command';
import cli from 'cli-ux';
import * as _ from 'lodash';

export default class DatasetsIndex extends BaseCommand {
    static description = 'List available datasets';

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
        ...cli.table.flags({ except: ['extended', 'output'] }),
    };

    async run() {
        const opts = this.parse(DatasetsIndex);
        const client = await this.lfmapClient();
        cli.action.start('fetching datasets');
        const res = await client.fetch('/v20200626/dictionary/datasets');
        cli.action.stop();
        switch (opts.flags.format) {
            case 'raw':
                if (opts.flags.pretty) {
                    this.pp(res);
                } else {
                    this.log(JSON.stringify(res));
                }
                break;
            case 'doc':
                if (opts.flags.pretty) {
                    res.records.forEach((rec: any) => this.pp(rec));
                } else {
                    res.records.forEach((rec: any) =>
                        this.log(JSON.stringify(rec))
                    );
                }
                break;
            case 'table':
                cli.table(
                    res.records,
                    {
                        id: {
                            header: 'ID',
                        },
                        name: {
                            minWidth: 7,
                        },
                        analysis_type: {},
                        dataset_type: {},
                        description: {},
                    },
                    {
                        printLine: this.log,
                        ..._.pick(opts.flags, _.keys(cli.table.flags())),
                    }
                );
                break;
            default:
                this.error('Unexpected output format');
                this.exit(1);
        }
    }
}
