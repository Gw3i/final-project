import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Trading Automation',
  description: 'Naming in progress...',
};

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {authModal}

        <main className={`${inter.className} p-4`}>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
