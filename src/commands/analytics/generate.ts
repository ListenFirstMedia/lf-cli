import BaseCommand from '../../base-command';

export default class AnalyticsGenerate extends BaseCommand {
    static description = 'Generate a query template';

    static flags = {
        ...BaseCommand.flags,
    };

    async run() {
        const data = {
            dataset_id: 'dataset_content_listenfirst',
            start_date: '2020-06-18',
            end_date: '2020-06-24',
            filters: [
                {
                    field: 'lfm.brand_view.set_names',
                    operator: 'IN',
                    values: ['My Brands'],
                },
                {
                    field: 'lfm.brand.name',
                    operator: '=',
                    values: ['CBS News'],
                },
            ],
            metrics: ['lfm.content.responses', 'lfm.content.reactions'],
            group_by: ['lfm.content.id'],
            sort: [
                {
                    field: 'lfm.content.reactions',
                    dir: 'DESC',
                },
            ],
            meta_dimensions: [
                'lfm.content.channel',
                'lfm.content.link',
                'lfm.content.text',
            ],
            per_page: 5,
        };
        this.pp(data);
    }
}
