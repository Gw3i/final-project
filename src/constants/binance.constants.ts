export const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3';
export const BINANCE_24H_TICKER_URL = '/ticker/24hr';

export const SUBSCRIPTION_CYCLE = ['H1', 'H4', 'H8', 'H12', 'WEEKLY', 'DAILY', 'MONTHLY', 'BI_WEEKLY'] as const;
export const WEEK_DAY = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
export const MONTH_DAY_NUMBER = Array.from({ length: 31 }, (_, index) => index + 1);
