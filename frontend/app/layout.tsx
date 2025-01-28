import type { Metadata } from 'next';

import './globals.css';
import './theme.css';

import styles from './layout.module.css';

import { Providers } from './Providers';
import { TabBar } from '@/components/TabBar/TabBar';

export const metadata: Metadata = {
  title: 'Logaliser',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
}
