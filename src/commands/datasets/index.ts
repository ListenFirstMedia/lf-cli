import ApiCommand from '../../api-command';

export default class DatasetsIndex extends ApiCommand {
    static description = 'List available datasets';

    static flags = {
        ...ApiCommand.flags,
    };

    async run() {
        const res = await this.fetch(
            '/v20200626/dictionary/datasets',
            undefined,
            'fetching datasets'
        );
        const cols = {
            id: {
                header: 'ID',
            },
            name: {
                minWidth: 7,
            },
            analysis_type: {},
            dataset_type: {},
            description: {},
        };

        this.outputRecords(res, cols);
    }
}
