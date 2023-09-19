import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import { FC } from 'react';
import { UserAuthForm } from './UserAuthForm';

const Auth: FC = async () => {
  const session = getAuthSession();

  return (
    <section className="relative grid gap-4 max-w-xl mx-auto pt-12 justify-center text-center">
      <h1 className="text-headline-large leading-[1.1]">Trading Automation</h1>
      <h2 className="text-body-medium">
        Welcome to your journey automating your Binance trading processes quick and easy
      </h2>

      <div className="mx-auto mt-4 flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
        <div className="flex flex-col space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account or login</h1>
        </div>
        <UserAuthForm />
        <p className="max-w-sm mx-auto text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
};

export default Auth;
