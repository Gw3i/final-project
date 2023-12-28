import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/Toaster';
import TransitionContainer from '@/components/TransitionContainer';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FolioOne',
  description:
    'Unleash the Power of Seamless Crypto Management - Your All-in-One Hub for Tracking Portfolios and Analyzing Data across Diverse Exchanges!',
};

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />

          {authModal}

          <main className={`${inter.className} p-4`}>
            <TransitionContainer>{children}</TransitionContainer>
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
