'use client';

import useTickers from '@/hooks/use-ticker';
import { FC } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface TickersTableProps {}

const TickersTable: FC<TickersTableProps> = ({}) => {
  const symbols = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'XRPUSDT',
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
      <article>
        <Table>
          <TableCaption>Cryptocurrency ticker list</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Change (24h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickerData.tickers &&
              tickerData.tickers.map((ticker) => (
                <TableRow key={ticker.symbol}>
                  <TableCell className="font-medium">{ticker.symbol}</TableCell>
                  <TableCell>{ticker.openPrice}</TableCell>
                  <TableCell>{ticker.priceChangePercent}%</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </article>
    </>
  );
};

export default TickersTable;
