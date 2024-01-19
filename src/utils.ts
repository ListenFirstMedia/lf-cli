import * as readline from 'node:readline';
import {
    split as _split,
    capitalize as _capitalize,
    join as _join,
    map as _map,
} from 'lodash';

import moment = require('moment');

const DATE_FMT = 'YYYY-MM-DD';

export const dateUtils = {
    yesterday: (): string => {
        return moment().subtract(1, 'days').format(DATE_FMT);
    },

    startOfMonth: (): string => {
        return moment().startOf('month').format(DATE_FMT);
    },

    startOfLastMonth: () => {
        return moment().subtract(1, 'month').startOf('month').format(DATE_FMT);
    },

    endOfLastMonth: () => {
        return moment().subtract(1, 'month').endOf('month').format(DATE_FMT);
    },

    startOfYear: () => {
        return moment().startOf('year').format(DATE_FMT);
    },

    startOfLastYear: () => {
        return moment().subtract(1, 'year').startOf('year').format(DATE_FMT);
    },

    endOfLastYear: () => {
        return moment().subtract(1, 'year').endOf('year').format(DATE_FMT);
    },

    startOfQuarter: (): string => {
        return moment().startOf('quarter').format(DATE_FMT);
    },

    startOfLastQuarter: () => {
        return moment()
            .subtract(1, 'quarter')
            .startOf('quarter')
            .format(DATE_FMT);
    },

    endOfLastQuarter: () => {
        return moment()
            .subtract(1, 'quarter')
            .endOf('quarter')
            .format(DATE_FMT);
    },

    nDaysAgo: (n: number): string => {
        return moment().subtract(n, 'days').format(DATE_FMT);
    },

    startOfNWeeksAgo: (n: number): string => {
        return moment().subtract(n, 'weeks').startOf('week').format(DATE_FMT);
    },

    endOfNWeeksAgo: (n: number): string => {
        return moment().subtract(n, 'weeks').endOf('week').format(DATE_FMT);
    },

    startOfNMonthsAgo: (n: number): string => {
        return moment().subtract(n, 'months').startOf('month').format(DATE_FMT);
    },

    endOfNMonthsAgo: (n: number): string => {
        return moment().subtract(n, 'months').endOf('month').format(DATE_FMT);
    },
};

export function verifyDateRange(startDateStr: string, endDateStr: string) {
    return moment(startDateStr, DATE_FMT)
        .startOf('day')
        .isBefore(moment(endDateStr, DATE_FMT).endOf('day'));
}

export async function parseStdin(): Promise<any> {
    return new Promise((resolve) => {
        const rl = readline.createInterface(process.stdin);
        let data = '';
        rl.on('line', (l) => {
            data += l;
        });
        rl.on('close', () => {
            resolve(JSON.parse(data));
        });
    });
}

export function titlecase(str?: string): string | undefined {
    if (str) {
        const parts = _split(str, /\s+/);
        return _join(_map(parts, _capitalize), ' ');
    }
}

export function normTitlecase(str?: string): string | undefined {
    if (str) {
        return titlecase(str.replace(/(\W|_)+/i, ' '));
    }
}
