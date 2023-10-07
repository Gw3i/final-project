'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export interface UserNavProps {
  session: Session;
}

const logout = (event: Event) => {
  const signInUrl = `${window.location.origin}/sign-in`;

  event.preventDefault();
  signOut({ callbackUrl: signInUrl });
};

const UserNav: FC<UserNavProps> = ({ session }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 bg-zinc-300">
            {session.user.image && <AvatarImage src={session.user.image} alt={`${session.user.name} avatar`} />}
            {!session.user.image && <AvatarFallback>$</AvatarFallback>}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {session.user.hasSecret ? (
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle2 className="w-4" /> Secrets added
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="w-4" /> No Secrets added
                </span>
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onSelect={logout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
