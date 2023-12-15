export interface NormalizedBalance {
  name: string;
  value: string;
}

export interface NormalizedBalanceWithCurrentPrice extends NormalizedBalance {
  currentPrice: string | null;
  totalPrice: number | null;
  isStaked: boolean;
}

export interface TotalBalance {
  totalStaked: number;
  totalFree: number;
}
