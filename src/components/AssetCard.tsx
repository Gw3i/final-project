import { Balance } from '@/types/user-data/binance-user-data.types';
import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface AssetCardProps {
  exchangeName: string;
  assets: Balance[];
  isLoading: boolean;
}

const AssetCard: FC<AssetCardProps> = ({ exchangeName, assets, isLoading }) => {
  return (
    <article className="bg-slate-100 rounded-lg p-4">
      <p className="uppercase font-semibold mb-4">{exchangeName}</p>

      {isLoading && <p>LOADING...</p>}

      {assets && !isLoading && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.asset}>
                <TableCell className="font-medium ">{asset.asset}</TableCell>
                <TableCell className="text-right">$ {asset.btcValuation}</TableCell>
                <TableCell className="text-right">
                  <p className="font-semibold">$ {Number(asset.free) * Number(asset.btcValuation)}</p>
                  <p>
                    {asset.free} {asset.asset}
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
