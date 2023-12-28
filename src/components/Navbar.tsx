import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import BalanceVisibilityButton from './BalanceVisibilityButton';
import Logo from './Logo';
import SignInDialog from './SignInDialog';
import UserNav from './UserNav';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="grid grid-cols-[1fr,auto,auto] items-center gap-2 px-4 py-2 pr-[15px] border-b border-b-slate-500">
      <Link href="/">
        <Logo />
      </Link>
      <div className="flex items-center">{session?.user && <BalanceVisibilityButton />} </div>

      <div className="grid grid-cols-[auto,1fr] gap-2">
        <Badge>BETA</Badge>

        {session?.user ? (
          <UserNav session={session} />
        ) : (
          <Dialog>
            <DialogTrigger>
              <Button>Sign In</Button>
            </DialogTrigger>
            <SignInDialog />
          </Dialog>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
