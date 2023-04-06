import BaseCommand from '../../base-command';

export default class BrandViewsGenerate extends BaseCommand {
    static description = `Generate a list parameters object example
    
The /brand_views endpoint allows filters, fields, and sort options
passed in as parameters.  The endpoint can be a little tricky as
parameter values are complex objects that need to be serialized
as a JSON string.   The cli's brand_views:list command provides
a convenience option to pass in the options as a JSON document.  
The command will prepare the request query for you making it
easier to use for complex queries.   This command produces
a complex example that can be used as a template.`;

    static flags = {
        ...BaseCommand.flags,
    };

    static examples = [
        '$ lf-cli brand-views:generate',
        '$ lf-cli brand-views:generate >| my-params.json',
    ];

    async run() {
        this.parse(BrandViewsGenerate);

        const fields = [
            'lfm.brand.broadcast_dayparts',
            'lfm.brand.primary_genre',
            'lfm.brand.genres',
            'lfm.brand.programmers',
            'lfm.brand.programmer_types',
        ];

        const filters = [];
        filters.push(
            {
                field: 'lfm.brand.genres',
                operator: 'IN',
                values: ['Comedy'],
            },
            {
                field: 'lfm.brand.primary_genre',
                operator: '=',
                values: ['Comedy'],
            },
            {
                field: 'lfm.brand.broadcast_dayparts',
                operator: 'IN',
                values: ['Prime Time'],
            },
            {
                field: 'lfm.brand.programmer_types',
                operator: 'IN',
                values: ['Premium Cable'],
            },
            {
                field: 'lfm.brand.programmers',
                operator: 'IN',
                values: ['HBO', 'Showtime', 'Epix'],
            }
        );

        const sort = [];
        sort.push({ field: 'lfm.brand.name', dir: 'DESC' });

        const data = { fields, filters, sort, per_page: 1000 };
        this.pp(data);
    }
}
