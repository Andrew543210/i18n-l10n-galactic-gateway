import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SpaceProvider } from '@/context/SpaceContext';
import '../globals.css';

export default async function LocaleLayout({
                                               children,
                                               params
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }
    setRequestLocale(locale);

    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
            <SpaceProvider>
                <Header />
                <div className="flex-1">
                    {children}
                </div>
                <Footer />
            </SpaceProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}