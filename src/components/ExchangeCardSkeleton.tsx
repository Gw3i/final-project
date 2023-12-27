import { Skeleton } from './ui/skeleton';

const ExchangeCardSkeleton = () => {
  return (
    <article className="grid h-[100px]">
      <div className="bg-transparent border border-gray-300 rounded-[10px] p-4">
        <div className="grid gap-1">
          <Skeleton className="bg-zinc-500 w-[140px] h-[32px] rounded-md" />
          <Skeleton className="bg-zinc-500 w-[100px] h-[24px] rounded-md" />
        </div>
      </div>
    </article>
  );
};

export default ExchangeCardSkeleton;
