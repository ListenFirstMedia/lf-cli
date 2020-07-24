import ApiCommand from '../../api-command';

export default class BrandViewSetsIndex extends ApiCommand {
    static aliases = ['brand_view_sets:list'];

    static description = `List Brand View Sets
    
Retrieve the list of a Brand View Sets available to the ListenFirst 
Account associated with the access token.`;

    static flags = {
        ...ApiCommand.flags,
    };

    async run() {
        const res = await this.fetch(
            '/v20200626/brand_view_sets?per_page=1000',
            undefined,
            'fetching brand view sets'
        );
        const cols = {
            id: {
                header: 'ID',
                minWidth: 10,
            },
            name: {},
        };

        this.outputRecords(res, cols);
    }
}
