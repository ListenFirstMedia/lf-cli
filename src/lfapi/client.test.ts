import Client from './client';
import { obtainAccessToken } from './auth';
import { ProfileSettings } from './config';
import * as moment from 'moment';
import * as querystring from 'node:querystring';

const LFM_API_CONFIG = {
    api_key: process.env.LFM_API_KEY,
    client_id: process.env.LFM_API_CLIENT_ID,
    client_secret: process.env.LFM_API_CLIENT_SECRET,
    auth_host: process.env.LFM_API_AUTH_HOST || 'auth.lfmdev.in',
    api_host: process.env.LFM_API_HOST || 'api.lfmdev.in',
    account_id: process.env.LFM_API_ACCOUNT_ID,
};

const { LFM_API_BRAND_ID: BRAND_ID } = process.env;

function nDaysAgo(n: number): string {
    return moment().subtract(n, 'days').format('YYYY-MM-DD');
}

describe('Client', () => {
    test('can fetch datasets', async () => {
        const tok = await obtainAccessToken(LFM_API_CONFIG as ProfileSettings);
        const client = new Client(tok, LFM_API_CONFIG as ProfileSettings);
        const res = await client.fetch('/v20200626/dictionary/datasets');
        expect(res).toBeTruthy();
        expect(res.records).toBeTruthy();
        expect((res.records as Array<any>).length).toBeGreaterThanOrEqual(0);
    });

    test('retrieve a few metrics for a single brand', async () => {
        const requestData = {
            dataset_id: 'dataset_brand_listenfirst',
            start_date: nDaysAgo(7),
            end_date: nDaysAgo(1),
            filters: [
                {
                    field: 'lfm.brand_view.id',
                    operator: '=',
                    values: [Number(BRAND_ID)],
                },
            ],
            metrics: [
                'lfm.audience_ratings.public_fan_acquisition_score',
                'lfm.audience_ratings.public_audience_footprint',
            ],
            group_by: ['lfm.fact.date_str', 'lfm.brand_view.id'],
            sort: [{ field: 'lfm.fact.date_str', dir: 'DESC' }],
            meta_dimensions: [
                'lfm.brand.name',
                'lfm.brand.genres',
                'lfm.brand.programmers',
            ],
        };

        const fetchOpts = {
            method: 'post',
            body: JSON.stringify(requestData),
        };

        const tok = await obtainAccessToken(LFM_API_CONFIG as ProfileSettings);
        const client = new Client(tok, LFM_API_CONFIG as ProfileSettings);

        const data = await client.fetch(
            '/v20200626/analytics/fetch',
            fetchOpts
        );

        expect(data).toBeDefined();
        expect(data.records).toBeDefined();
        expect(typeof data.records).toBe('object');
        expect(Array.isArray(data.records)).toBeTruthy();
        expect(data.records.length).toBeGreaterThan(0);
    });

    test('find a brand by id', async () => {
        const filters = [
            {
                field: 'lfm.brand_view.id',
                operator: '=',
                values: [BRAND_ID],
            },
            {
                field: 'lfm.brand_view.type',
                operator: '=',
                values: ['STANDARD'],
            },
        ];
        const filterParam = JSON.stringify(filters);
        const queryStr = querystring.stringify({
            filters: filterParam,
        });

        const tok = await obtainAccessToken(LFM_API_CONFIG as ProfileSettings);
        const client = new Client(tok, LFM_API_CONFIG as ProfileSettings);
        const data = await client.fetch(`/v20200626/brand_views?${queryStr}`);

        expect(data).toBeDefined();
        expect(data.records.length).toBe(1);
        for (const bv of data.records) {
            expect(bv.id).toBe(Number(BRAND_ID));
        }

        expect(data.records.length).toBe(1);
    });
});
