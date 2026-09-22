import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LangSwitcher from './LangSwitcher';

export default function Header() {
    const t = useTranslations('Navigation');

    return (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-400 hover:text-indigo-300 transition">
                    <span>🌌</span> Galactic Gateway
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-300 hover:text-white transition"
                    >
                        {t('home')}
                    </Link>

                    <Link
                        href="/about"
                        className="text-sm font-medium text-slate-300 hover:text-white transition"
                    >
                        {t('about')}
                    </Link>

                    <LangSwitcher />
                </nav>
            </div>
        </header>
    );
}