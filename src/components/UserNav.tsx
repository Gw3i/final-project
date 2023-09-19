'use client';

import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { Button } from './ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/Dropdown-menu';

export interface UserNavProps {
  user: Pick<User, 'email' | 'image' | 'name'>;
}

const logout = (event: Event) => {
  const signInUrl = `${window.location.origin}/sign-in`;

  event.preventDefault();
  signOut({ callbackUrl: signInUrl });
};

const UserNav: FC<UserNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user.image && <AvatarImage src={user.image} alt={`${user.name} avatar`} />}
            {!user.image && <AvatarFallback>$</AvatarFallback>}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
