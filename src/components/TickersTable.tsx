'use client';

import useTickers from '@/hooks/use-ticker';
import { formatPrice } from '@/lib/utils/format-price';
import { formatPriceChange } from '@/lib/utils/format-price-change';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

const TickersTable = () => {
  const symbols = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'XRPUSDT',
    'USDCUSDT',
    'ADAUSDT',
    'SOLUSDT',
    'DOGEUSDT',
    'TRXUSDT',
    'DAIUSDT',
    'DOTUSDT',
    'MATICUSDT',
    'LTCUSDT',
    'BCHUSDT',
  ];

  const tickerData = useTickers({ symbols, interval: 60000 });

  return (
    <>
      <section>
        {tickerData.isLoading && <p className="text-center">Loading...</p>}

        {tickerData.tickers && !tickerData.isLoading && (
          <Table>
            <TableCaption>Top Cryptocurrency Ticker list</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Symbol</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Change (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickerData.tickers &&
                tickerData.tickers.map((ticker) => (
                  <TableRow key={ticker.symbol}>
                    <TableCell className="font-medium">{ticker.symbol}</TableCell>
                    <TableCell>{formatPrice(ticker.lastPrice)}</TableCell>
                    <TableCell
                      className={`text-right ${
                        ticker.priceChangePercent.includes('-') ? 'text-red-500' : 'text-green-500'
                      }`}
                    >
                      {ticker.priceChangePercent.includes('-') ? '' : '+'}
                      {formatPriceChange(ticker.priceChangePercent)}%
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </section>
    </>
  );
};

export default TickersTable;
