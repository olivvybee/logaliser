import { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';

import { TabBar } from '@/components/TabBar/TabBar';

import { Providers } from './Providers';

import './globals.css';
import './theme.css';

import styles from './layout.module.css';

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--dm-sans',
});

export const metadata: Metadata = {
  title: 'Logaliser',
  appleWebApp: {
    capable: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'dark',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <Providers>
          <div className={styles.contentWrapper}>{children}</div>
          <TabBar />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
