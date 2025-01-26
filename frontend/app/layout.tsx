import type { Metadata } from 'next';

import './globals.css';
import './theme.css';

import { Providers } from './Providers';

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
