export interface KrakenBalanceResponse {
  [key: string]: string;
}

export interface KrakenBalance {
  name: string;
  value: string;
}

export interface KrakenBalanceWithCurrentPrice {
  name: string;
  value: string;
  currentPrice: string | null;
  totalPrice: number | null;
  isStaked: boolean;
}

export interface KrakenSortedBalance {
  freeAssets: KrakenBalanceWithCurrentPrice[];
  stackedAssets: KrakenBalanceWithCurrentPrice[];
}
