import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import UserNav from './UserNav';
import { buttonVariants } from './ui/button';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="flex justify-between items-center px-4 py-2 pr-[15px] border-b border-b-slate-500">
      <Link href="/">LOGO</Link>
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
