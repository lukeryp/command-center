import type { Metadata, Viewport } from 'next';
import { Raleway, Work_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import AuthProvider from '@/components/AuthProvider';
import SwRegister from '@/components/SwRegister';
import { AppContextProvider } from '@/lib/app-context';

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RYP Command Center',
  description: 'Luke\'s personal operating system — RYP Golf',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Command Center',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d0d0d',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${raleway.variable} ${workSans.variable} h-full`}>
      <body className="min-h-full bg-[#0d0d0d] text-white antialiased">
        <AuthProvider>
          <AppContextProvider>
            <SwRegister />
            <Header />
            <main>{children}</main>
          </AppContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
