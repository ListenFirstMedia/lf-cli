import * as inquirer from 'inquirer';
import ApiCommand from '../../api-command';
import {
    partition as _partition,
    map as _map,
    sortBy as _sortBy,
    filter as _filter,
    concat as _concat,
    uniq as _uniq,
    find as _find,
    difference as _difference,
} from 'lodash';
import { cli } from 'cli-ux';
import { dateUtils, verifyDateRange } from '../../utils';

export default class QueryBuilder extends ApiCommand {
    static description =
        'Build an analytics query through an interactive dialogue';

    static flags = {
        ...ApiCommand.flags,
    };

    static examples = ['$ lf-cli analytics:query-builder'];

    async run() {
        // const opts = this.parse(QueryBuilder);
        const client = await this.lfapiClient();
        const query: any = {};
        cli.action.start('Fetching datasets');
        const res = await client.fetch('/v20200626/dictionary/datasets');
        cli.action.stop();
        const analysisDatasets = _filter(
            res.records,
            (ds) => ds.dataset_type === 'ANALYTIC'
        );

        const [brandDatasets, contentDatasets] = _partition(
            analysisDatasets,
            (ds) => ds.analysis_type === 'BRAND'
        );

        // const
        // const parts = _.split(res.records, (ds) => ds.id )
        const questions = [
            {
                type: 'list',
                name: 'analysis_type',
                message: 'Select the scope of the query',
                choices: [
                    { value: 'BRAND', name: 'Brand Level' },
                    { value: 'CONTENT', name: 'Content Level' },
                ],
            },
            {
                type: 'list',
                name: 'dataset_id',
                message: 'Select the Dataset for the query',
                choices: (ses: any) => {
                    const datasets =
                        ses.analysis_type === 'CONTENT'
                            ? contentDatasets
                            : brandDatasets;
                    const dsOptions = _map(datasets, (ds: any) => {
                        return { name: ds.name, value: ds.id };
                    });
                    return _sortBy(dsOptions, (ds) => ds.name);
                },
            },
            {
                type: 'list',
                name: 'start_date',
                message: (ses: any) => {
                    return ses.analysis_type === 'CONTENT'
                        ? 'Select the window start date (filters on lfm.content.published_on_date_str)'
                        : 'Select the window start date (filters on lfm_fact_date_str)';
                },
                choices: [
                    { name: 'Yesterday', value: dateUtils.yesterday() },
                    {
                        name: 'Start of Current Month',
                        value: dateUtils.startOfMonth(),
                    },
                    {
                        name: 'Start of Last Month',
                        value: dateUtils.startOfLastMonth(),
                    },
                    {
                        name: 'Start of Current Year',
                        value: dateUtils.startOfYear(),
                    },
                    {
                        name: 'Start of Last Year',
                        value: dateUtils.startOfLastYear(),
                    },
                    {
                        name: 'Start of Current Quarter',
                        value: dateUtils.startOfQuarter(),
                    },
                    {
                        name: 'Start of Last Quarter',
                        value: dateUtils.startOfLastQuarter(),
                    },
                    {
                        name: 'Start of Current Week',
                        value: dateUtils.startOfNWeeksAgo(0),
                    },
                    {
                        name: 'Start of Last Week',
                        value: dateUtils.startOfNWeeksAgo(1),
                    },
                    { name: 'Custom Date', value: 'CUSTOM' },
                ],
            },
            {
                type: 'input',
                name: 'custom_start_date',
                when: (ses: any) => ses.start_date === 'CUSTOM',
                message: 'Enter custom start date (YYYY-MM-DD)',
                validate: async (str: string) => {
                    if (str.match(/^(\d{4})-(\d{2})-(\d{2})$/i)) {
                        const yesterday = dateUtils.yesterday();
                        if (verifyDateRange(str, yesterday)) {
                            return true;
                        }
                        return 'Start date must be less than or equal to yesterday';
                    }
                    return 'Invalid Date';
                },
            },
            {
                type: 'list',
                name: 'end_date',
                message: (ses: any) => {
                    return ses.analysis_type === 'CONTENT'
                        ? 'Select the window end date (filters on lfm.content.published_on_date_str)'
                        : 'Select the window end date (filters on lfm_fact_date_str)';
                },
                choices: (ses: any) => {
                    const defaults = [
                        { name: 'Yesterday', value: dateUtils.yesterday() },
                        {
                            name: 'End of Last Month',
                            value: dateUtils.endOfLastMonth(),
                        },
                        {
                            name: 'End of Last Year',
                            value: dateUtils.endOfLastYear(),
                        },
                        {
                            name: 'End of Last Quarter',
                            value: dateUtils.endOfLastQuarter(),
                        },
                        {
                            name: 'End of Last Week',
                            value: dateUtils.endOfNWeeksAgo(1),
                        },
                        { name: 'Custom', value: 'CUSTOM' },
                    ];
                    const startDate = ses.custom_start_date || ses.start_date;
                    return _filter(defaults, (opt) => {
                        return (
                            verifyDateRange(startDate, opt.value) ||
                            opt.value === 'CUSTOM'
                        );
                    });
                },
            },
            {
                type: 'input',
                name: 'custom_end_date',
                when: (ses: any) => ses.end_date === 'CUSTOM',
                message: 'Enter custom end date (YYYY-MM-DD)',
                validate: async (str: string, ses: any) => {
                    if (str.match(/^(\d{4})-(\d{2})-(\d{2})$/i)) {
                        const startDate =
                            ses.custom_start_date || ses.start_date;
                        if (verifyDateRange(startDate, str)) {
                            return true;
                        }
                        return 'End date must be greater than or equal to start date';
                    }
                    return 'Invalid Date';
                },
            },
            {
                type: 'checkbox',
                name: 'metrics',
                message: 'Select metrics to query',
                choices: async (ses: any) => {
                    cli.action.start('Fetching dataset fields');
                    const res = await client.fetch(
                        `/v20200626/dictionary/datasets/${ses.dataset_id}`
                    );
                    cli.action.stop();

                    ses.dataset_fields = res.record.fields;

                    const metricFields = _filter(
                        ses.dataset_fields,
                        (field) => field.class === 'METRIC'
                    );

                    return _map(metricFields, (field) => {
                        return {
                            name: field.name,
                            value: field.id,
                        };
                    });
                },
                validate: async (data: any) => {
                    this.pp(data);
                    if (data.length > 0) {
                        return true;
                    }
                    return 'At least one metric is required';
                },
            },
            {
                type: 'checkbox',
                name: 'group_by',
                message: 'Select dimensions to group by',
                choices: async (ses: any) => {
                    const dimFields = _filter(ses.dataset_fields, (field) => {
                        return (
                            field.class === 'DIMENSION' &&
                            field.capabilities.includes('GROUPABLE')
                        );
                    });

                    return _map(dimFields, (field) => {
                        return {
                            name: field.name,
                            value: field.id,
                        };
                    });
                },
                validate: async (data: any) => {
                    if (data.length > 0) {
                        return true;
                    }
                    return 'At least one group by field is required';
                },
            },
            {
                type: 'checkbox',
                name: 'meta_dims',
                when: async (ses: any) => {
                    const includeBSAs = ses.group_by.includes(
                        'lfm.brand_view.id'
                    );
                    const includeCSAs = ses.group_by.includes('lfm.content.id');
                    const dimFields = _filter(ses.dataset_fields, (field) => {
                        // meta dimensions for brands may only be added if brand_view id is
                        // included in the group by
                        const isBSA = /^lfm\.brand/.test(field.id);
                        const isCSA = !isBSA;
                        if (!includeBSAs && isBSA) {
                            return false;
                        }

                        if (!includeCSAs && isCSA) {
                            return false;
                        }

                        return (
                            field.class === 'DIMENSION' &&
                            !ses.group_by.includes(field.id)
                            // && field.capabilities.includes('SELECTABLE')
                        );
                    });
                    ses.possibleMetaDims = dimFields;
                    return dimFields.length > 0;
                },
                message:
                    'Select additional meta dimensions to include in query response (optional)',
                choices: async (ses: any) => {
                    return _map(ses.possibleMetaDims, (field) => {
                        return { value: field.id, name: field.name };
                    });
                },
            },
        ];

        const answers = await inquirer.prompt(questions);

        // handle sort loop
        let sortDone = false;
        const sortRules: Array<any> = [];
        while (!sortDone) {
            const sortQuestions = [
                {
                    type: 'confirm',
                    name: 'add_sort_field',
                    message: 'Add a sort rule?',
                },
                {
                    type: 'list',
                    name: 'sort_field',
                    when: (ses: any) => {
                        return ses.add_sort_field;
                    },
                    message: 'Select a field to sort by',
                    choices: async () => {
                        let sortables = _filter(
                            _uniq(
                                _concat(
                                    answers.metrics,
                                    answers.group_by,
                                    answers.meta_dimensions
                                )
                            ),
                            (f: any) => f
                        );
                        if (sortRules.length > 0) {
                            sortables = _difference(
                                sortables,
                                _map(sortRules, (sr) => sr.field)
                            );
                        }

                        const sortableFields = _map(
                            sortables,
                            (fieldID: string) => {
                                this.pp(fieldID);
                                return _find(
                                    answers.dataset_fields,
                                    (f) => f.id === fieldID
                                );
                            }
                        );

                        return _map(sortableFields, (field: any) => {
                            return { value: field.id, name: field.name };
                        });
                    },
                    validate: async (data: string) => {
                        if (data.length > 0) {
                            return true;
                        }
                        return 'Select a field to sort by';
                    },
                },
                {
                    type: 'list',
                    name: 'sort_direction',
                    message: 'Select the sort direction for this field',
                    default: 'ASC',
                    when: (ses: any) => {
                        return ses.add_sort_field && ses.sort_field.length > 0;
                    },
                    choices: [
                        {
                            value: 'ASC',
                            name: 'Ascending',
                        },
                        {
                            value: 'DESC',
                            name: 'Descending',
                        },
                    ],
                },
            ];

            // eslint-disable-next-line no-await-in-loop
            const sortAnswers = await inquirer.prompt(sortQuestions);

            if (sortAnswers.add_sort_field) {
                sortRules.push({
                    field: sortAnswers.sort_field,
                    dir: sortAnswers.sort_direction,
                });
            } else {
                sortDone = true;
            }
        }

        query.dataset_id = answers.dataset_id;
        query.start_date = answers.custom_start_date || answers.start_date;
        query.end_date = answers.custom_end_date || answers.end_date;
        query.metrics = answers.metrics;
        query.group_by = answers.group_by;
        query.page = 1;
        query.per_page = 100;
        query.filters = [
            {
                field: 'lfm.brand_view.set_names',
                operator: 'IN',
                values: ['My Brands'],
            },
        ];
        if (sortRules.length > 0) {
            query.sort = sortRules;
        }
        if (answers.meta_dims !== undefined && answers.meta_dims.length > 0) {
            query.meta_dimensions = answers.meta_dims;
        }
        this.pp(query);
    }
}
