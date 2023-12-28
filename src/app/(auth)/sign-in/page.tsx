import Logo from '@/components/Logo';
import { UserAuthForm } from '@/components/UserAuthForm';
import Link from 'next/link';

const Page = () => {
  return (
    <section className="w-full relative grid gap-2 pt-8 text-center sm:px-8 sm:max-w-[52rem] md:px-10 lg:px-12">
      <div className="hidden absolute -z-10 md:block md:-right-[380px] lg:-right-[520px] xl:-right-[768px] animate-spin logo-spin-duration">
        <Logo width="700" height="700" />
      </div>

      <h1 className="text-[64px] sm:text-[92px] leading-[1.1] text-left font-gambetta-bold">
        Your Exchanges in one Place.
      </h1>
      <h2 className="text-body text-left">
        Unleash the Power of Seamless Crypto Management - Your All-in-One Hub for Tracking Portfolios and Analyzing Data
        across Diverse Exchanges!
      </h2>

      <div className="mt-10 flex w-full flex-col justify-center gap-2 sm:w-[350px]">
        <div className="flex flex-col space-y-1 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account or login</h1>
        </div>
        <UserAuthForm />
        <p className="max-w-sm text-left text-sm text-muted-foreground">
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

export default Page;
