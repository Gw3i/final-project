export const normalizeKrakenPairs = (pair: string | null) => {
  switch (pair) {
    // X pairs
    case 'ETHUSD':
      return 'XETHZUSD';
    case 'XRPUSD':
      return 'XXRPZUSD';
    case 'ETCUSD':
      return 'XETCZUSD';
    case 'LTCUSD':
      return 'XLTCZUSD';
    case 'MLNUSD':
      return 'XMLNZUSD';
    case 'REPUSD':
      return 'XREPZUSD';
    case 'XBTUSD':
      return 'XXBTZUSD';
    case 'XDGUSD':
      return 'XXDGZUSD';
    case 'XLMUSD':
      return 'XXLMZUSD';
    case 'XMRUSD':
      return 'XXMRZUSD';
    case 'ZECUSD':
      return 'XZECZUSD';

    //   Z pairs
    case 'EURUSD':
      return 'ZEURZUSD';
    case 'AUDUSD':
      return 'ZAUDZUSD';
    case 'GBPUSD':
      return 'ZGBPZUSD';
    case 'USDUSD':
      return 'ZUSDZUSD';
    case 'CADUSD':
      return 'ZCADZUSD';
    case 'JPYUSD':
      return 'ZJPYZUSD';

    default:
      return pair;
  }
};
