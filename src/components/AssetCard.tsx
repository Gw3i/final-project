import { normalizeBalance } from '@/lib/utils/balance.util';
import { NormalizedBalanceWithCurrentPrice } from '@/types/user-data/balance.types';
import { KrakenBalanceWithCurrentPrice } from '@/types/user-data/kraken-user-data.types';
import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Skeleton } from './ui/skeleton';

interface AssetCardProps {
  exchangeName: string;
  assets: NormalizedBalanceWithCurrentPrice[];
  isLoading: boolean;
  isBalanceVisible: boolean;
}

const AssetCard: FC<AssetCardProps> = ({ exchangeName, assets, isLoading, isBalanceVisible }) => {
  const assetList = normalizeBalance(assets);

  const total = assetList.reduce(
    (previous: number, current: KrakenBalanceWithCurrentPrice) => previous + (Number(current.totalPrice) || 0),
    0,
  );

  return (
    <article className="bg-slate-100 rounded-lg py-6 px-4">
      <div className="flex justify-between items-center uppercase font-semibold mb-4 text-2xl">
        <p>{exchangeName}</p>
        <div>
          {isLoading ? (
            <Skeleton className="bg-zinc-500 w-[100px] h-[30px] rounded-md" />
          ) : (
            <p>${isBalanceVisible ? total.toFixed(2) : '******'}</p>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Asset</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading &&
            [1, 2, 3, 4, 5].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium ">
                  <Skeleton className="bg-zinc-500 w-[40px] h-[20px] rounded-md" />
                </TableCell>
                <TableCell className="">
                  <div className="flex justify-end">
                    <Skeleton className="bg-zinc-500 w-[100px] h-[20px] rounded-md" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="grid justify-items-end gap-1">
                    <Skeleton className="bg-zinc-500 w-[60px] h-[18px] rounded-md" />
                    <Skeleton className="bg-zinc-500 w-[120px] h-[18px] rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {assetList.length > 0 &&
            !isLoading &&
            assetList.map(
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
                      {asset.totalPrice && isBalanceVisible ? (
                        <div>
                          <p className="font-semibold">${asset.totalPrice.toFixed(2)}</p>
                          <p>
                            {asset.value} {asset.name}
                          </p>
                        </div>
                      ) : (
                        <p>*********</p>
                      )}
                    </TableCell>
                  </TableRow>
                ),
            )}
        </TableBody>
      </Table>
    </article>
  );
};

export default AssetCard;
