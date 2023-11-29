import { Balance } from '@/types/user-data/binance-user-data.types';
import { FC } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';

interface AssetCardProps {
  exchangeName: string;
  assets: Balance[];
}

const AssetCard: FC<AssetCardProps> = ({ exchangeName, assets }) => {
  return (
    <article className="bg-slate-100 rounded-lg p-4">
      <p className="uppercase font-semibold mb-4">{exchangeName}</p>

      {assets && (
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
                <TableCell className="font-medium">{asset.asset}</TableCell>
                <TableCell className="text-right">{asset.btcValuation}</TableCell>
                <TableCell className="text-right">{asset.free}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </article>
  );
};

export default AssetCard;
