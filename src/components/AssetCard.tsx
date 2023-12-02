import { normalizeBalance } from '@/lib/utils/balance.util';
import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import { KrakenBalance } from '@/types/user-data/kraken-user-data.types';
import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface AssetCardProps {
  exchangeName: string;
  assets: BinanceBalance[] | KrakenBalance[];
  isLoading: boolean;
}

const AssetCard: FC<AssetCardProps> = ({ exchangeName, assets, isLoading }) => {
  const assetList = normalizeBalance(assets);

  return (
    <article className="bg-slate-100 rounded-lg p-4">
      <p className="uppercase font-semibold mb-4 text-2xl">{exchangeName}</p>

      {isLoading && <p>LOADING...</p>}

      {assetList.length > 1 && !isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assetList.map((asset) => (
              <TableRow key={asset.name}>
                <TableCell className="font-medium ">{asset.name}</TableCell>
                <TableCell className="text-right">$ </TableCell>
                <TableCell className="text-right">
                  <p className="font-semibold">$</p>
                  <p>
                    {asset.value} {asset.name}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </article>
  );
};

export default AssetCard;
