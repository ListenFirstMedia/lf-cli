import ApiCommand from '../../api-command';

export default class DatasetsIndex extends ApiCommand {
    static aliases = ['datasets:list'];

    static description = `List Datasets

Retrieves all Datasets available. See the Data Dictionary 
for available Datasets. A subset of the dataset attributes 
will be returned in the response.`;

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
