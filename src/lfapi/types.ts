export interface AccessToken {
    access_token: string;
    expires_in: number;
    token_type: string;
}

export enum FieldClass {
    METRIC = 'METRIC',
    DIMENSION = 'DIMENSION',
}

export enum FieldDataType {
    STRING = 'STRING',
    INTEGER = 'INTEGER',
    FLOAT = 'FLOAT',
    DATETIME = 'DATETIME',
    BOOLEAN = 'BOOLEAN',
    STRINGSET = 'STRINGSET',
    INTEGERSET = 'INTEGERSET',
}

export enum FieldCapabilities {
    SORTABLE = 'SORTABLE',
    FILTERABLE = 'FILTERABLE',
    GROUPABLE = 'GROUPABLE',
    SELECTABLE = 'SELECTABLE',
}

export enum FieldInterval {
    LIFETIME = 'LIFETIME',
    DELTA = 'DELTA',
    NA = 'N/A',
}

export enum AnalysisType {
    CONTENT = 'CONTENT',
    BRAND = 'BRAND',
}

export enum DatasetType {
    ANALYTIC = 'ANALYTIC',
    DIMENSION_GROUP = 'DIMENSION_GROUP',
}

export enum AuthorizationType {
    STRICT = 'STRICT',
    PARTIAL = 'PARTIAL',
}

export enum StatAttributionMode {
    LIFETIME = 'LIFETIME',
    IN_WINDOW = 'IN_WINDOW',
    IN_ACTION = 'IN_ACTION',
}

export enum StabilityState {
    EXPERIMENTAL = 'EXPERIMENTAL',
    BETA = 'BETA',
    GA = 'GA',
    DEPRECATED = 'DEPRECATED',
    EOL = 'EOL',
}

export enum FilterOperator {
    EQ = '=',
    IN = 'IN',
    ILIKE = 'ILIKE',
    BETWEEN = 'BETWEEN',
}

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export interface FieldBasic {
    id: string;
    name: string;
    class: FieldClass;
    data_type: FieldDataType;
}

export interface FieldExtended extends FieldBasic {
    description: string;
    capabilities: Array<FieldCapabilities>;
    public: boolean;
    listable: boolean;
    interval: FieldInterval;
    stability_state: StabilityState;
}

export interface Dataset {
    id: string;
    name: string;
    description: string;
    dataset_type: DatasetType;
    analysis_type: AnalysisType;
    primary_time_field?: string;
    authorization_type: AuthorizationType;
    stat_attribution_modes: Array<StatAttributionMode>;
    stability_state: Array<StabilityState>;
    fields: Array<FieldExtended>;
}

export interface Filter {
    field: string;
    operator: FilterOperator;
    values: Array<string | number>;
}

export interface Sort {
    field: string;
    dir: SortDirection;
}

export interface FetchJob {
    fetch_params: AnalyticalQuery;
}

export interface ScheduleConfig {
    fetch_params: AnalyticalQuery;
    cron_expression: string;
}

export interface AnalyticalQuery {
    dataset_id: string;
    start_date: string;
    end_date: string;
    metrics: Array<string>;
    group_by: Array<string>;
    filters?: Array<Filter>;
    sort?: Array<Sort>;
    meta_dimensions?: Array<string>;
    page?: number;
    per_page?: number;
}

export interface BrandViewQuery {
    fields: Array<string>;
    group_by: Array<string>;
    filters: Array<Filter>;
    sort: Array<Sort>;
    page?: number;
    per_page?: number;
}

export enum BrandViewType {
    CUSTOM = 'CUSTOM',
    STANDARD = 'STANDARD',
}

export interface BrandView {
    id: string;
    name: string;
    type: BrandViewType;
    dimensions?: Map<string, any>;
}

export interface BrandViewSet {
    id: number;
    name: string;
}

export interface TableObjectResponse {
    columns: Array<FieldBasic>;
    records: Array<Array<any>>;
    page: number;
    has_more_pages: boolean;
}
