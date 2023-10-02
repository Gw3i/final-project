import { MoveUpRight, Repeat2 } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface PresetsProps {}

const Presets: FC<PresetsProps> = ({}) => {
  return (
    <section className="grid grid-cols-[minmax(0,300px),minmax(0,300px)] gap-4 justify-center">
      <Link
        className="flex flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none"
        href="#"
      >
        <Repeat2 />
        Periodically Buy
      </Link>

      <Link
        className="flex  flex-col justify-center items-center gap-2 py-12 text-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground focus-visible:border-primary active:border-primary outline-none"
        href="#"
      >
        <MoveUpRight />
        Buy Latest
      </Link>
    </section>
  );
};

export default Presets;
