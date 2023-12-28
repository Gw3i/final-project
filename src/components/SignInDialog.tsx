import Link from 'next/link';
import { UserAuthForm } from './UserAuthForm';
import { DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const SignInDialog = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl text-center font-semibold tracking-tight">
          Create an account or login
        </DialogTitle>
      </DialogHeader>
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
    </DialogContent>
  );
};

export default SignInDialog;
