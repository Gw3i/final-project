import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import BalanceVisibilityButton from './BalanceVisibilityButton';
import UserNav from './UserNav';
import { buttonVariants } from './ui/button';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="grid grid-cols-[1fr,auto,auto] items-center gap-2 px-4 py-2 pr-[15px] border-b border-b-slate-500">
      <Link href="/">
        <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {' '}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M130.888 47.0671C132.644 42.9611 133.618 38.4302 133.618 33.6683C133.618 15.0738 118.769 0 100.452 0C82.1353 0 67.2864 15.0738 67.2864 33.6683C67.2864 38.4302 68.2602 42.9611 70.0167 47.0671C63.9884 38.6431 54.2072 33.1658 43.1658 33.1658C24.8488 33.1658 10 48.2397 10 66.8342C10 83.4412 21.8443 97.24 37.4252 100C21.8443 102.76 10 116.559 10 133.166C10 151.76 24.8488 166.834 43.1658 166.834C54.2072 166.834 63.9884 161.357 70.0167 152.933C68.2602 157.039 67.2864 161.57 67.2864 166.332C67.2864 184.926 82.1353 200 100.452 200C118.769 200 133.618 184.926 133.618 166.332C133.618 161.57 132.644 157.039 130.888 152.933C136.916 161.357 146.697 166.834 157.739 166.834C176.056 166.834 190.905 151.76 190.905 133.166C190.905 116.559 179.06 102.76 163.479 100C179.06 97.24 190.905 83.4412 190.905 66.8342C190.905 48.2397 176.056 33.1658 157.739 33.1658C146.697 33.1658 136.916 38.6431 130.888 47.0671ZM127.303 146.565C125.547 142.459 124.573 137.928 124.573 133.166C124.573 116.559 136.417 102.76 151.998 100C136.417 97.24 124.573 83.4412 124.573 66.8342C124.573 62.0723 125.547 57.5414 127.303 53.4354C121.275 61.8594 111.494 67.3367 100.452 67.3367C89.4109 67.3367 79.6297 61.8594 73.6014 53.4354C75.3579 57.5414 76.3317 62.0723 76.3317 66.8342C76.3317 83.4412 64.4874 97.24 48.9065 100C64.4874 102.76 76.3317 116.559 76.3317 133.166C76.3317 137.928 75.3579 142.459 73.6014 146.565C79.6297 138.141 89.4109 132.663 100.452 132.663C111.494 132.663 121.275 138.141 127.303 146.565Z"
            fill="url(#paint0_linear_231_113)"
          />{' '}
          <defs>
            {' '}
            <linearGradient
              id="paint0_linear_231_113"
              x1="170.1"
              y1="-9.23648e-06"
              x2="31.8635"
              y2="138.679"
              gradientUnits="userSpaceOnUse"
            >
              {' '}
              <stop stopColor="#B0B9FF" /> <stop offset="1" stopColor="#E7E9FF" />{' '}
            </linearGradient>{' '}
          </defs>{' '}
        </svg>
      </Link>

      <div className="flex items-center">
        <div className="mt-[10px]">
          <BalanceVisibilityButton />
        </div>
      </div>

      <div>
        {session?.user ? (
          <UserNav session={session} />
        ) : (
          <Link className={buttonVariants({ variant: 'default' })} href="/sign-in">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
