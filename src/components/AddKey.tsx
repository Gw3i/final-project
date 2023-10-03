import { Button } from '@/components/ui/Button';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import KeyForm from './KeyForm';

interface AddKeyProps {}

const AddKey: FC<AddKeyProps> = ({}) => {
  return (
    <section className="grid items-center justify-center text-center">
      <h2 className="text-headline-small mb-8">Setup API Connection</h2>
      <p className="max-w-sm text-center">
        For using trading feature, setup your API Key & Secret on Binance. Follow these instructions to generate an
        Binance API key
      </p>

      <Button asChild variant="link">
        <Link
          className="flex items-center gap-[2px]"
          target="_blank"
          href="https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072"
        >
          <span>How to generate a Binance API Key</span>
          <MoveUpRight width={16} height={16} />
        </Link>
      </Button>
      <p className="text-xs text-red-500">Only enable Reading and Sport & Margin Trading!</p>

      <div className="mt-8">
        <KeyForm />
      </div>
    </section>
  );
};

export default AddKey;
