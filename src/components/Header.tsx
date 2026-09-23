'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSpace } from '@/context/SpaceContext';
import LangSwitcher from './LangSwitcher';

export default function Header() {
    const tNav = useTranslations('Navigation');
    const { cart } = useSpace();

    return (
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Galactic Gateway
                </Link>

                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-indigo-400 transition">
                        {tNav('home')}
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-indigo-400 transition">
                        {tNav('about')}
                    </Link>
                    <Link href="/cabinet" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                        <span>{tNav('cabinet')}</span>
                        {cart.length > 0 && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-xs font-black rounded-full animate-bounce">
                                {cart.length}
                            </span>
                        )}
                    </Link>

                    <LangSwitcher />
                </nav>
            </div>
        </header>
    );
}