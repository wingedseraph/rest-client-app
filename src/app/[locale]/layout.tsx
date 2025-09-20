import '@app/globals.css';
import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';

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
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
