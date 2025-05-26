// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Layout from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PropSales - Immobilien Verkaufsplattform',
  description: 'Moderne Plattform für den Vertrieb von Immobilien',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}