import NextTopLoader from 'nextjs-toploader';
import '@app/globals.css';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';

import Navigation from '@/shared/ui/Navigation/Navigation';
import Footer from '@/widgets/layout/Footer/Footer';
import Header from '@/widgets/layout/Header/Header';

import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages: Record<
    PropertyKey,
    Record<PropertyKey, string>
  > = await getMessages({ locale });
  const title = messages.metadata.title;
  const description = messages.metadata.description;

  return {
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
  };
}

type LocaleLayoutParams = {
  params: Promise<{ locale: string }>;
  children: ReactNode;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutParams) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <NextTopLoader
            color={'oklch(0.145 0 0)'}
            height={6}
            easing={'ease-in '}
            showSpinner={false}
            shadow={false}
          />
          <Header />
          <div className="h-10 w-full bg-muted">
            <Navigation />
          </div>
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
