import * as inquirer from 'inquirer';
import {
    partition as _partition,
    map as _map,
    sortBy as _sortBy,
    filter as _filter,
    concat as _concat,
    uniq as _uniq,
    find as _find,
    difference as _difference,
    split as _split,
} from 'lodash';
import { cli } from 'cli-ux';
import { dateUtils, verifyDateRange } from './utils';
import Client from './lfapi/client';
import {
    Dataset,
    AnalysisType,
    DatasetType,
    FieldClass,
    FieldCapabilities,
    FieldExtended,
    FieldDataType,
    BrandViewSet,
    FilterOperator,
    SortDirection,
    Sort,
    BrandViewQuery,
    AnalyticalQuery,
    Filter,
} from './lfapi/types';

async function fetchDatasets(client: Client): Promise<Array<Dataset>> {
    cli.action.start('Fetching datasets');
    const res = await client.fetch('/v20200626/dictionary/datasets');
    cli.action.stop();
    return res.records;
}

async function fetchBrandSets(client: Client): Promise<Array<BrandViewSet>> {
    cli.action.start('Fetching Brand Sets');
    const res = await client.fetch('/v20200626/brand_view_sets?per_page=1000');
    cli.action.stop();
    return res.records;
}

async function fetchFieldValues(
    client: Client,
    field: string
): Promise<Array<string>> {
    cli.action.start('Fetching Field Values');
    const res = await client.fetch(
        `/v20200626/dictionary/field_values?field=${field}`
    );
    cli.action.stop();
    return res.records;
}

async function fetchDataset(
    client: Client,
    datasetID: string
): Promise<Dataset> {
    cli.action.start('Fetching dataset fields');
    const res = await client.fetch(
        `/v20200626/dictionary/datasets/${datasetID}`
    );
    cli.action.stop();
    return res.record;
}

function promptAnalysisType(): inquirer.ListQuestion {
    return {
        type: 'list',
        name: 'analysis_type',
        message: 'Select the scope of the query',
        choices: [
            { value: AnalysisType.BRAND, name: 'Brand Level' },
            { value: AnalysisType.CONTENT, name: 'Content Level' },
        ],
    };
}

function prompDataset(datasets: Array<Dataset>): inquirer.ListQuestion {
    const analysisDatasets = _filter(
        datasets,
        (ds) => ds.dataset_type === DatasetType.ANALYTIC
    );

    const [brandDatasets, contentDatasets] = _partition(
        analysisDatasets,
        (ds) => ds.analysis_type === AnalysisType.BRAND
    );

    return {
        type: 'list',
        name: 'dataset_id',
        message: 'Select the Dataset for the query',
        choices: (ses: any) => {
            const datasets =
                ses.analysis_type === AnalysisType.CONTENT
                    ? contentDatasets
                    : brandDatasets;
            const dsOptions = _map(datasets, (ds: Dataset) => {
                return { name: ds.name, value: ds.id };
            });
            return _sortBy(dsOptions, (ds) => ds.name);
        },
    };
}

function promptStartDate(): inquirer.ListQuestion {
    return {
        type: 'list',
        name: 'start_date',
        message: (ses: any) => {
            return ses.analysis_type === AnalysisType.CONTENT
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
    };
}

function promptCustomStartDate(): inquirer.InputQuestion {
    return {
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
    };
}

function promptEndDate(): inquirer.ListQuestion {
    return {
        type: 'list',
        name: 'end_date',
        message: (ses: any) => {
            return ses.analysis_type === AnalysisType.CONTENT
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
    };
}

function promptCustomEndDate(): inquirer.InputQuestion {
    return {
        type: 'input',
        name: 'custom_end_date',
        when: (ses: any) => ses.end_date === 'CUSTOM',
        message: 'Enter custom end date (YYYY-MM-DD)',
        validate: async (str: string, ses: any) => {
            if (str.match(/^(\d{4})-(\d{2})-(\d{2})$/i)) {
                const startDate = ses.custom_start_date || ses.start_date;
                if (verifyDateRange(startDate, str)) {
                    return true;
                }
                return 'End date must be greater than or equal to start date';
            }
            return 'Invalid Date';
        },
    };
}

function promptMetrics(client: Client): inquirer.CheckboxQuestion {
    return {
        type: 'checkbox',
        name: 'metrics',
        message: 'Select metrics to query',
        choices: async (ses: any) => {
            ses.dataset_record = await fetchDataset(client, ses.dataset_id);

            const metricFields = _filter(
                ses.dataset_record.fields,
                (field) => field.class === FieldClass.METRIC
            );

            return _map(metricFields, (field) => {
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
            return 'At least one metric is required';
        },
    };
}

function promptMetaDims(): inquirer.CheckboxQuestion {
    return {
        type: 'checkbox',
        name: 'meta_dims',
        when: async (ses: any) => {
            const includeBSAs = ses.group_by.includes('lfm.brand_view.id');
            const includeCSAs = ses.group_by.includes('lfm.content.id');
            const dimFields = _filter(ses.dataset_record.fields, (field) => {
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
                    field.class === FieldClass.DIMENSION &&
                    !ses.group_by.includes(field.id)
                    // && field.capabilities.includes(FieldCapabilities.SELECTABLE)
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
    };
}

function promptGroupBy(): inquirer.CheckboxQuestion {
    return {
        type: 'checkbox',
        name: 'group_by',
        message: 'Select dimensions to group by',
        choices: async (ses: any) => {
            const dimFields = _filter(ses.dataset_record.fields, (field) => {
                return (
                    field.class === FieldClass.DIMENSION &&
                    field.capabilities.includes(FieldCapabilities.GROUPABLE)
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
    };
}

function promptBrandDims(dataset: Dataset): inquirer.CheckboxQuestion {
    return {
        type: 'checkbox',
        name: 'fields',
        when: async (ses: any) => {
            const dimFields = _filter(dataset.fields, (field) => {
                return (
                    field.class === FieldClass.DIMENSION &&
                    /^lfm\.brand/.test(field.id) &&
                    field.id !== 'lfm.brand_view.name'
                );
            });
            ses.possibleMetaDims = dimFields;
            return dimFields.length > 0;
        },
        message: 'Select dimension fields to include in response',
        choices: async (ses: any) => {
            return _map(ses.possibleMetaDims, (field) => {
                return { value: field.id, name: field.name };
            });
        },
    };
}
function promptPerPage(): inquirer.InputQuestion {
    return {
        type: 'input',
        name: 'per_page',
        default: '100',
        message: 'Enter page size limit',
        validate: async (str: string) => {
            if (str.match(/^(\d+)$/i)) {
                if (Number(str) > 0 && Number(str) <= 1000) {
                    return true;
                }
                return 'Page size must be a positive number less than or equal to 1000';
            }
            return 'Invalid size';
        },
    };
}

function promptSortField(sortableFields: Array<FieldExtended>) {
    return {
        type: 'list',
        name: 'sort_field',
        when: (ses: any) => {
            return ses.add_sort_rule;
        },
        message: 'Select a field to sort by',
        choices: async () => {
            return _map(sortableFields, (field: FieldExtended) => {
                return {
                    value: field.id,
                    name: field.name,
                };
            });
        },
        validate: async (data: string) => {
            if (data.length > 0) {
                return true;
            }
            return 'Select a field to sort by';
        },
    };
}

function promptSortDirection(): inquirer.ListQuestion {
    return {
        type: 'list',
        name: 'sort_direction',
        message: 'Select the sort direction for this field',
        default: 'ASC',
        when: (ses: any) => {
            return ses.add_sort_rule && ses.sort_field.length > 0;
        },
        choices: [
            {
                value: SortDirection.ASC,
                name: 'Ascending',
            },
            {
                value: SortDirection.DESC,
                name: 'Descending',
            },
        ],
    };
}

async function sortRuleBuilder(
    dataset: Dataset,
    possibleFields: Array<string>
): Promise<Array<Sort>> {
    // handle sort loop
    let sortDone = false;
    const sortRules: Array<Sort> = [];

    while (!sortDone) {
        // identify possible fields (must be included in query to be in sort)
        const sortables = _difference(
            possibleFields,
            _map(sortRules, (sr) => sr.field)
        );

        if (sortables.length > 0) {
            // find field definitions for all sortables
            const sortableFields: Array<FieldExtended> = [];
            sortables.forEach((fieldID) => {
                const field = _find(dataset.fields, (f) => f.id === fieldID);
                if (field !== undefined) {
                    sortableFields.push(field);
                }
            });

            const sortQuestions: Array<inquirer.Question> = [
                {
                    type: 'confirm',
                    name: 'add_sort_rule',
                    message: 'Add a sort rule?',
                },
            ];
            sortQuestions.push(promptSortField(sortableFields));
            sortQuestions.push(promptSortDirection());

            // eslint-disable-next-line no-await-in-loop
            const sortAnswers = await inquirer.prompt(sortQuestions);

            if (sortAnswers.add_sort_rule) {
                sortRules.push({
                    field: sortAnswers.sort_field,
                    dir: sortAnswers.sort_direction,
                });
            } else {
                sortDone = true;
            }
        } else {
            sortDone = true;
        }
    }

    return sortRules;
}

function promptFilterField(
    filterFields: Array<FieldExtended>
): inquirer.ListQuestion {
    return {
        type: 'list',
        name: 'field',
        message: 'Select the field for the filter expression',
        when: (ses: any) => {
            return ses.add_filter_expr;
        },
        choices: () => {
            return _map(filterFields, (f) => {
                return {
                    name: f.name,
                    value: f.id,
                };
            });
        },
        validate: (input: string) => {
            if (input.length > 0) {
                return true;
            }
            return 'A field selection is required';
        },
    };
}

function promptFilterOperator(
    filterFields: Array<FieldExtended>
): inquirer.ListQuestion {
    return {
        type: 'list',
        name: 'operator',
        message: 'Select the comparison operator for the filter expression',
        when: (ses: any) => {
            return ses.add_filter_expr;
        },
        choices: (ses: any) => {
            const field = _find(filterFields, (f) => f.id === ses.field);
            if (field !== undefined) {
                ses.field_record = field;
                switch (field.data_type) {
                    case FieldDataType.DATETIME:
                        return [FilterOperator.EQ, FilterOperator.BETWEEN];
                    case FieldDataType.FLOAT:
                        return [
                            FilterOperator.EQ,
                            FilterOperator.IN,
                            FilterOperator.BETWEEN,
                        ];
                    case FieldDataType.INTEGER:
                        return [
                            FilterOperator.EQ,
                            FilterOperator.IN,
                            FilterOperator.BETWEEN,
                        ];
                    case FieldDataType.STRING:
                        return [
                            FilterOperator.EQ,
                            FilterOperator.IN,
                            FilterOperator.ILIKE,
                        ];
                    case FieldDataType.STRINGSET:
                        return [FilterOperator.IN, FilterOperator.ILIKE];
                    case FieldDataType.INTEGERSET:
                        return [FilterOperator.IN];
                    case FieldDataType.BOOLEAN:
                        return [FilterOperator.EQ, FilterOperator.IN];
                    default:
                        return [FilterOperator.IN];
                }
            }
            return [];
        },
        validate: (input: string) => {
            if (input.length > 0) {
                return true;
            }
            return 'An operator is required';
        },
    };
}

function promptBrandSetFilter(client: Client): inquirer.CheckboxQuestion {
    return {
        type: 'checkbox',
        name: 'brand_set_values',
        when: (ses: any) => {
            return (
                ses.add_filter_expr &&
                ses.operator === FilterOperator.IN &&
                (ses.field === 'lfm.brand_view.set_names' ||
                    ses.field === 'lfm.brand_view.set_ids')
            );
        },
        choices: async (ses: any) => {
            const brandSets = await fetchBrandSets(client);
            const valueAttr =
                ses.field === 'lfm.brand_view.set_names' ? 'name' : 'id';
            return _map(brandSets, (bs) => {
                return {
                    name: bs.name,
                    value: bs[valueAttr],
                };
            });
        },
        validate: (input: Array<string>) => {
            if (input.length > 0) {
                return true;
            }
            return 'Please select at least one Brand Set';
        },
    };
}

function promptFilterListValue(client: Client): inquirer.CheckboxQuestion {
    return {
        type: 'checkbox',
        name: 'field_list_values',
        when: (ses: any) => {
            return (
                ses.add_filter_expr &&
                (ses.operator === FilterOperator.IN ||
                    ses.operator === FilterOperator.EQ) &&
                ses.field_record &&
                ses.field_record.listable
            );
        },
        choices: async (ses: any) => {
            const fieldValues = await fetchFieldValues(client, ses.field);
            return fieldValues;
        },
        validate: (input: Array<string>, ses: any) => {
            if (input.length === 0) {
                return 'Please select a filter value';
            }
            if (ses.operator === '=' && input.length > 1) {
                return 'Select only one value in an equal expression';
            }
            return true;
        },
    };
}

function promptFilterValue(): inquirer.InputQuestion {
    return {
        type: 'input',
        name: 'values',
        message:
            'Enter value for filter expression (comma separate multiple values)',
        when: (ses: any) => {
            return (
                ses.add_filter_expr &&
                (ses.brand_set_values === undefined ||
                    ses.brand_set_values.length === 0) &&
                (ses.field_list_values === undefined ||
                    ses.field_list_values.length === 0) &&
                ses.operator !== FilterOperator.BETWEEN
            );
        },
        validate: (input: string) => {
            if (input.length > 0) {
                return true;
            }
            return 'Enter a valid filter value';
        },
    };
}

function promptFilterBetweenLhs(): inquirer.InputQuestion {
    return {
        type: 'input',
        name: 'between_value_lhs',
        message: 'Enter left hand side value of between filter expression',
        when: (ses: any) => {
            return (
                ses.add_filter_expr &&
                (ses.brand_set_values === undefined ||
                    ses.brand_set_values.length === 0) &&
                (ses.field_list_values === undefined ||
                    ses.field_list_values.length === 0) &&
                ses.operator === FilterOperator.BETWEEN
            );
        },
        validate: (input: string) => {
            if (input.length > 0) {
                return true;
            }
            return 'Enter a valid filter value';
        },
    };
}

function promptFilterBetweenRhs(): inquirer.InputQuestion {
    return {
        type: 'input',
        name: 'between_value_rhs',
        message: 'Enter right hand side value of between filter expression',
        when: (ses: any) => {
            return (
                ses.add_filter_expr &&
                (ses.brand_set_values === undefined ||
                    ses.brand_set_values.length === 0) &&
                (ses.filter_list_values === undefined ||
                    ses.brand_list_values.length === 0) &&
                ses.operator === FilterOperator.BETWEEN
            );
        },
        validate: (input: string) => {
            if (input.length > 0) {
                return true;
            }
            return 'Enter a valid filter value';
        },
    };
}

async function filtersBuilder(
    client: Client,
    dataset: Dataset
): Promise<Array<Filter>> {
    // handle sort loop
    let dialogueDone = false;
    const filters: Array<Filter> = [];

    let filterFields = _filter(dataset.fields, (field) => {
        return field.capabilities.includes(FieldCapabilities.FILTERABLE);
    });

    while (!dialogueDone) {
        // if already in sort rules, exclude from sortable list
        if (filters.length > 0) {
            const selectedFilters = _map(filters, (f) => f.field);
            filterFields = _filter(
                filterFields,
                (f) => !selectedFilters.includes(f.id)
            );
        }

        if (filterFields.length > 0) {
            // find field definitions for all sortables
            const filterQuestions: Array<inquirer.Question> = [
                {
                    type: 'confirm',
                    name: 'add_filter_expr',
                    message: 'Add a filter expression?',
                },
            ];
            filterQuestions.push(promptFilterField(filterFields));
            filterQuestions.push(promptFilterOperator(filterFields));
            filterQuestions.push(promptBrandSetFilter(client));
            filterQuestions.push(promptFilterListValue(client));
            filterQuestions.push(promptFilterValue());
            filterQuestions.push(promptFilterBetweenLhs());
            filterQuestions.push(promptFilterBetweenRhs());

            // eslint-disable-next-line no-await-in-loop
            const filterAnswers = await inquirer.prompt(filterQuestions);

            if (filterAnswers.add_filter_expr) {
                let values = [];
                if (filterAnswers.operator === FilterOperator.BETWEEN) {
                    values.push(filterAnswers.between_value_lhs);
                    values.push(filterAnswers.between_value_rhs);
                } else if (filterAnswers.field_list_values) {
                    values = filterAnswers.field_list_values;
                } else if (filterAnswers.brand_set_values) {
                    values = filterAnswers.brand_set_values;
                } else {
                    values = _split(filterAnswers.values, ',');
                }

                filters.push({
                    field: filterAnswers.field,
                    operator: filterAnswers.operator,
                    values: values,
                });
            } else {
                dialogueDone = true;
            }
        } else {
            dialogueDone = true;
        }
    }

    return filters;
}

function buildAnalyticsQuery(answers: any): AnalyticalQuery {
    const query: AnalyticalQuery = {
        dataset_id: answers.dataset_id,
        start_date: answers.custom_start_date || answers.start_date,
        end_date: answers.custom_end_date || answers.end_date,
        metrics: answers.metrics,
        group_by: answers.group_by,
        page: 1,
        per_page: Number(answers.per_page),
        filters: [],
        sort: [],
        meta_dimensions: [],
    };
    if (answers.meta_dims !== undefined && answers.meta_dims.length > 0) {
        query.meta_dimensions = answers.meta_dims;
    }
    return query;
}

export async function analyticsQueryBuilder(client: Client) {
    const datasets = await fetchDatasets(client);
    // const parts = _.split(res.records, (ds) => ds.id )
    const questions = [];
    questions.push(promptAnalysisType());
    questions.push(prompDataset(datasets));
    questions.push(promptStartDate());
    questions.push(promptCustomStartDate());
    questions.push(promptEndDate());
    questions.push(promptCustomEndDate());
    questions.push(promptMetrics(client));
    questions.push(promptGroupBy());
    questions.push(promptMetaDims());
    questions.push(promptPerPage());
    const answers = await inquirer.prompt(questions);
    const query: AnalyticalQuery = buildAnalyticsQuery(answers);

    // identify possible fields (must be included in query to be in sort)
    const sortables = _filter(
        _uniq(_concat(query.metrics, query.group_by, query.meta_dimensions)),
        (f: string | undefined) => f !== undefined
    );
    const sortRules = await sortRuleBuilder(answers.dataset_record, sortables);
    const filters = await filtersBuilder(client, answers.dataset_record);

    if (filters.length > 0) {
        query.filters = filters;
    }

    if (sortRules.length > 0) {
        query.sort = sortRules;
    }

    return query;
}

export async function brandViewsQueryBuilder(client: Client) {
    const dataset = await fetchDataset(client, 'dataset_brand_metadata');

    const questions = [];
    questions.push(promptBrandDims(dataset));
    questions.push(promptPerPage());
    const answers = await inquirer.prompt(questions);
    const query: BrandViewQuery = {
        fields: answers.fields,
        per_page: Number(answers.per_page),
        group_by: [],
        filters: [],
        sort: [],
    };

    const sortRules = await sortRuleBuilder(dataset, [
        'lfm.brand_view.name',
        'lfm.brand.name',
        'lfm.brand_view.id',
    ]);
    const filters = await filtersBuilder(client, dataset);

    if (filters.length > 0) {
        query.filters = filters;
    }

    if (sortRules.length > 0) {
        query.sort = sortRules;
    }

    return query;
}
