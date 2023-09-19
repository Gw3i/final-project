'use client';

import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icons';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import * as React from 'react';
import { useState } from 'react';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (error) {
      toast({
        title: 'There was a problem',
        description: 'An error occurred while trying to login with Google.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Button onClick={loginWithGoogle} variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>
    </div>
  );
}
