import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC } from 'react';
import { UserAuthForm } from './UserAuthForm';
import { buttonVariants } from './ui/Button';

interface SignInProps {}

const SignIn: FC<SignInProps> = ({}) => {
  return (
    <section className="relative grid gap-4 max-w-xl mx-auto pt-12 justify-center text-center">
      <h1 className="text-headline-large">Trading Automation</h1>
      <h2 className="text-body-medium">
        Welcome to your journey automating your Binance trading processes quick and easy
      </h2>

      <Link
        href="/examples/authentication"
        className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-[16px] top-0 md:right-8 md:top-8')}
      >
        Login
      </Link>

      <div className="mx-auto mt-4 flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
        <div className="flex flex-col space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
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

export default SignIn;
