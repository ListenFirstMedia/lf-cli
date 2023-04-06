import { flags } from '@oclif/command';
import { split as _split } from 'lodash';
import { Table } from 'cli-ux';
import { normTitlecase } from '../utils';

export const brandViewFlags = {
    fields: flags.string({
        description: 'Comma seperated list of fields to include',
        required: false,
    }),
};

export interface ParsedFields {
    fields: string[];
    cols: Table.table.Columns<any>;
}

export function brandViewColumns(fields: string[]): Table.table.Columns<any> {
    const cols: Table.table.Columns<any> = {
        id: {
            header: 'ID',
            minWidth: 10,
        },
        name: {
            header: 'Brand View Name',
        },
        brand_name: {
            header: 'Brand Name',
            get: (row) => row.dimensions['lfm.brand.name'],
        },
        type: {},
    };
    for (const field of fields) {
        cols[field] = {
            header: normTitlecase(_split(field, '.').pop()),
            get: (row) => row.dimensions[field],
        };
    }

    return cols;
}

export function parseBrandViewFieldsFlag(val?: string): ParsedFields {
    const pf: ParsedFields = {
        fields: [],
        cols: {},
    };

    if (val) {
        pf.fields = _split(val, ',');
    }

    pf.cols = brandViewColumns(pf.fields);

    return pf;
}
