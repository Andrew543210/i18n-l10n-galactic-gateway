'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LangSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        router.replace(pathname, { locale: nextLocale });
    };

    return (
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-xs text-slate-400 font-medium">🌐</span>
            <select
                value={locale}
                onChange={handleLanguageChange}
                className="bg-transparent text-sm text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
                <option value="uk" className="bg-slate-900 text-slate-100">Українська</option>
                <option value="en" className="bg-slate-900 text-slate-100">English</option>
            </select>
        </div>
    );
}