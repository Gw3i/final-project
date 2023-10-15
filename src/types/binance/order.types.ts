export interface AcknowledgementResponse {
  symbol: string;
  orderId: number;
  orderListId: number; // Unless OCO, value will be -1
  clientOrderId: string;
  transactTime: number;
}

export interface ResultResponse extends AcknowledgementResponse {
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  workingTime: number;
  selfTradePreventionMode: string;
}

export interface Fill {
  price: string;
  qty: string;
  commission: string;
  commissionAsset: string;
  tradeId: number;
}

export interface FullResponse extends ResultResponse {
  fills: Fill[];
}

export interface Interval {
  label: string;
  value: string;
  time: number;
}

export type SubscriptionCycle = 'H1' | 'H4' | 'H8' | 'H12' | 'WEEKLY' | 'DAILY' | 'MONTHLY' | 'BI_WEEKLY';

export type AutoInvestPlayType = 'SINGLE' | 'PORTFOLIO' | 'INDEX';

export type WeekDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
