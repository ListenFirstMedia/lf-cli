import { BrandViewsByBrandSetNameCommand } from './by-brand-set-name';

export default class BrandViewsMyBrands extends BrandViewsByBrandSetNameCommand {
    static description = `List My Brands

Convenience command to fetch the Brand Views associated with the "My Brands"
Brand View Set`;

    static flags = {
        ...BrandViewsByBrandSetNameCommand.flags,
    };

    async run() {
        const opts = this.parse(BrandViewsMyBrands);
        await this.process(opts.flags, 'My Brands');
    }
}
