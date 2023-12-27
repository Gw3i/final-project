import { Skeleton } from './ui/skeleton';

const TickerListItemSkeleton = () => {
  return (
    <li className="grid grid-cols-[1fr,auto] gap-2 items-center bg-transparent border border-gray-300 rounded-[10px] p-2">
      <div className="grid gap-[2px]">
        <Skeleton className="bg-zinc-500 w-[60px] h-[24px] rounded-md" />
        <Skeleton className="bg-zinc-500 w-[160px] h-[22px] rounded-md" />
      </div>
      <Skeleton className="bg-zinc-500 w-[60px] h-[24px] rounded-md" />
    </li>
  );
};

export default TickerListItemSkeleton;
