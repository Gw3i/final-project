import { normalizeBalance } from '@/lib/utils/balance.util';
import { NormalizedBalanceWithCurrentPrice } from '@/types/user-data/balance.types';
import { KrakenBalanceWithCurrentPrice } from '@/types/user-data/kraken-user-data.types';
import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface AssetCardProps {
  exchangeName: string;
  assets: NormalizedBalanceWithCurrentPrice[];
  isLoading: boolean;
}

const AssetCard: FC<AssetCardProps> = ({ exchangeName, assets, isLoading }) => {
  const assetList = normalizeBalance(assets);

  const total = assetList.reduce(
    (previous: number, current: KrakenBalanceWithCurrentPrice) => previous + (Number(current.totalPrice) || 0),
    0,
  );

  return (
    <article className="bg-slate-100 rounded-lg py-6 px-4">
      <div className="flex justify-between items-center uppercase font-semibold mb-4 text-2xl">
        <p>{exchangeName}</p>
        <p>${total.toFixed(2)}</p>
      </div>

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
                      <p>${asset.currentPrice ? Number(asset.currentPrice).toFixed(5) : 'Not found'}</p>{' '}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* TODO: Convert values and prices into integers */}
                      {/* TODO: Trim total when something like 30.05000000000000 */}
                      {asset.totalPrice && <p className="font-semibold">${asset.totalPrice.toFixed(2)}</p>}
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
