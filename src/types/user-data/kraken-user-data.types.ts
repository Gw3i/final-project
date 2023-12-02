export interface KrakenBalance {
  [key: string]: string;
}

export interface KrakenSortedBalance {
  freeAssets: KrakenBalance[];
  stackedAssets: KrakenBalance[];
}
