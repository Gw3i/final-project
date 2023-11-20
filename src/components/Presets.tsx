'use client';

import { ArrowDownUp, MoveUpRight, Repeat2, Target } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface PresetsProps {
  hasSecret?: boolean;
}

const Presets: FC<PresetsProps> = ({ hasSecret }) => {
  return (
    <article className="grid grid-cols-[minmax(0,300px),minmax(0,300px)] gap-4 justify-center">
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
        href="index-invest"
      >
        <Target />
        Index Invest
      </Link>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="range"
      >
        <ArrowDownUp />
        Range Trading
      </Link>

      <Link
        className={`flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none ${
          !hasSecret ? 'pointer-events-none text-muted-foreground' : 'text-foreground'
        }`}
        href="/latest"
      >
        <MoveUpRight />
        Buy Latest
      </Link>
    </article>
  );
};

export default Presets;
