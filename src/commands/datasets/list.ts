import ApiCommand from '../../api-command';

export default class DatasetsList extends ApiCommand {
    static aliases = ['datasets:list'];

    static description = `List Datasets

Retrieves all Datasets available. See the Data Dictionary 
for available Datasets. A subset of the dataset attributes 
will be returned in the response.`;

    static flags = {
        ...ApiCommand.flags,
    };

    static examples = [
        '$ lf-cli datasets:list --pretty',
        '$ lf-cli datasets:list --format table',
        '$ lf-cli datasets:list --format table --csv > datasets.csv',
        '$ lf-cli datasets:list --format doc > datasets.jsonl',
    ];

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
