import type { Metadata, Viewport } from 'next';

import './globals.css';
import './theme.css';

import styles from './layout.module.css';

import { Providers } from './Providers';
import { TabBar } from '@/components/TabBar/TabBar';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'Logaliser',
  appleWebApp: {
    capable: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'dark',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
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
