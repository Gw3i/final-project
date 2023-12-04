import { normalizeBalance } from '@/lib/utils/balance.util';
import { BinanceBalance } from '@/types/user-data/binance-user-data.types';
import { KrakenBalanceWithCurrentPrice } from '@/types/user-data/kraken-user-data.types';
import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface AssetCardProps {
  exchangeName: string;
  assets: BinanceBalance[] | KrakenBalanceWithCurrentPrice[];
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
            {assetList.map(
              (asset) =>
                !asset.isStaked && (
                  <TableRow key={asset.name}>
                    <TableCell className="font-medium ">{asset.name}</TableCell>
                    <TableCell className="text-right">
                      <p>$ {asset.currentPrice ?? 'Not found'}</p>{' '}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* TODO: Convert values and prices into integers */}
                      {/* TODO: Trim total when something like 30.05000000000000 */}
                      {asset.totalPrice && <p className="font-semibold">$ {asset.totalPrice.toFixed(13)}</p>}
                      <p>
                        {asset.value} {asset.name}
                      </p>
                    </TableCell>
                  </TableRow>
                ),
            )}
          </TableBody>
        </Table>
      )}
    </article>
  );
};

export default AssetCard;
