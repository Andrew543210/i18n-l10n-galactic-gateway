import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-16 text-slate-400 text-sm">
            <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>© 2026 Galactic Gateway. {t('rights')}</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-slate-200 transition">{t('privacy')}</a>
                    <a href="#" className="hover:text-slate-200 transition">{t('terms')}</a>
                </div>
            </div>
        </footer>
    );
}