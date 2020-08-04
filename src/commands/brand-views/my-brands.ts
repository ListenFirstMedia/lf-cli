import { BrandViewsByBrandSetNameCommand } from './by-brand-set-name';

export default class BrandViewsMyBrands extends BrandViewsByBrandSetNameCommand {
    static description = `List My Brands

Convenience command to fetch the Brand Views associated with the "My Brands"
Brand View Set`;

    static flags = {
        ...BrandViewsByBrandSetNameCommand.flags,
    };

    static examples = [
        '$ lf-cli brand-views:my-brands --pretty --fields lfm.brand.primary_genre',
        '$ lf-cli brand-views:my-brands --max-page -1 --format table',
        '$ lf-cli brand-views:my-brands --fields lfm.brand.primary_genre --show-curl',
        '$ lf-cli brand-views:my-brands --show-curl | sh',
    ];

    async run() {
        const opts = this.parse(BrandViewsMyBrands);
        await this.process(opts.flags, 'My Brands');
    }
}
