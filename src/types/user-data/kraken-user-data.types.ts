export interface KrakenBalanceResponse {
  [key: string]: string;
}

export interface KrakenBalance {
  name: string;
  value: string;
}

export interface KrakenSortedBalance {
  freeAssets: KrakenBalance[];
  stackedAssets: KrakenBalance[];
}
