'use client';

import { toast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ArrowDownUp, MoveUpRight, Repeat2, Target } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface PresetsProps {
  hasSecret?: boolean;
}

const Presets: FC<PresetsProps> = ({ hasSecret }) => {
  const { mutate: getAssetList, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.post('/api/binance/auto-invest-asset/list');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          title: error.message,
          description: error.response?.data,
          variant: 'destructive',
        });
      }
    },
    onSuccess: () => {
      return toast({
        title: 'Connection created successfully!',
        description: 'The connection was successfully created.',
        variant: 'default',
      });
    },
  });

  return (
    <article className="grid grid-cols-[minmax(0,300px),minmax(0,300px)] gap-4 justify-center">
      <button onClick={() => getAssetList()}>Get Asset List</button>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="/auto-invest"
      >
        <Repeat2 />
        Auto Invest
      </Link>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="/dca"
      >
        <Repeat2 />
        Periodically Buy
      </Link>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="#"
      >
        <Target />
        Buy/Sell on specific price
      </Link>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="#"
      >
        <ArrowDownUp />
        Range Trading
      </Link>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="#"
      >
        <MoveUpRight />
        Buy Latest
      </Link>
    </article>
  );
};

export default Presets;
