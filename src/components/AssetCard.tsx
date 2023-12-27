'use client';

import { normalizeBalance } from '@/lib/utils/balance.util';
import { NormalizedBalanceWithCurrentPrice } from '@/types/user-data/balance.types';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface AssetCardProps {
  headline?: string;
  exchangeName?: string;
  assets: NormalizedBalanceWithCurrentPrice[];
  isLoading: boolean;
  isBalanceVisible: boolean;
  totalBalance: number;
  hasLink?: boolean;
  itemsAmountToRender?: number;
}

const AssetCard: FC<AssetCardProps> = ({
  headline,
  exchangeName,
  assets,
  isLoading,
  isBalanceVisible,
  totalBalance,
  hasLink = false,
  itemsAmountToRender,
}) => {
  // TODO: Fix - Some Kraken assets have balance 0
  const [visibleItems, setVisibleItems] = useState(itemsAmountToRender || 10);

  const assetList = normalizeBalance(assets);

  const loadMoreAssets = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + (itemsAmountToRender ?? 10));
  };

  const showIcon = (assetName: string) => {
    const url = `/icons/${assetName.toLowerCase()}.svg`;
    const placeholderUrl = '/icons/generic.svg';

    return (
      <Image
        src={url}
        width={20}
        height={20}
        alt={`${assetName} icon`}
        onError={(error) => {
          const imgElement = error.target as HTMLImageElement;

          imgElement.src = placeholderUrl;
        }}
      />
    );
  };

  const getContentTpl = () => {
    return (
      <>
        <div className="flex justify-between items-center uppercase font-semibold mb-4 text-2xl">
          <p>{exchangeName ?? headline}</p>
          <div>
            {isLoading ? (
              <Skeleton className="bg-zinc-500 w-[100px] h-[32px] rounded-md" />
            ) : (
              <p>${isBalanceVisible ? totalBalance.toFixed(2) : '******'}</p>
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Asset</TableHead>
              <TableHead className="hidden text-right sm:table-cell">Price</TableHead>
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
                  <TableCell>
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
              assetList.slice(0, visibleItems).map(
                (asset) =>
                  Number(asset.value) !== 0 && (
                    <TableRow key={asset.name}>
                      <TableCell className="hidden font-medium py-2 sm:table-cell">
                        <span className="inline-flex gap-1 items-center">
                          {showIcon(asset.name)}
                          <span>{asset.name}</span>
                        </span>
                      </TableCell>
                      <TableCell className="hidden text-right py-2 sm:table-cell">
                        <p>${asset.currentPrice ? Number(asset.currentPrice).toFixed(5) : 'Not found'}</p>
                      </TableCell>
                      <TableCell className="font-medium py-2 sm:hidden">
                        <span className="inline-flex gap-1 items-center">
                          {showIcon(asset.name)}
                          <span>{asset.name}</span>
                        </span>
                        <span>
                          <p>${asset.currentPrice ? Number(asset.currentPrice).toFixed(5) : 'Not found'}</p>
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-2">
                        {asset.totalPrice && (
                          <div>
                            <p className="font-semibold">
                              {isBalanceVisible ? <span>${asset.totalPrice.toFixed(2)}</span> : <span>******</span>}
                            </p>
                            <p>
                              {isBalanceVisible ? (
                                <span>
                                  {asset.value} {asset.name}
                                </span>
                              ) : (
                                <span>*********</span>
                              )}
                            </p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ),
              )}
          </TableBody>
        </Table>

        {visibleItems < assetList.length && (
          <div className="flex justify-center mt-4">
            <Button onClick={loadMoreAssets}>Load More</Button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      {hasLink ? (
        <Link
          href={`/portfolio/${exchangeName?.toLowerCase()}`}
          className="bg-transparent  border border-gray-300 rounded-[10px] py-6 px-4 hover:border-gray-200 hover:bg-gray-30 hover:bg-opacity-50 focus-visible:bg-gray-100 active:bg-gray-100 focus-visible:bg-opacity-40 active:bg-opacity-40 transition-colors"
        >
          {getContentTpl()}
        </Link>
      ) : (
        <div className="bg-transparent  border border-gray-300 rounded-[10px] py-6 px-4">{getContentTpl()}</div>
      )}
    </>
  );
};

export default AssetCard;
