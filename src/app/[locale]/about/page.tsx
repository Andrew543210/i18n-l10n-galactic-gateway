import { useTranslations } from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('Hero');

    return (
        <main className="max-w-4xl mx-auto px-8 py-16 space-y-6">
            <h1 className="text-4xl font-bold text-indigo-300">
                Mission & Science
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
                {t('subtitle')}
            </p>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <h2 className="text-xl font-semibold text-white">
                    make commercial spaceflight accessible
                </h2>
                <p className="text-sm text-slate-400">
                    Our gateway coordinates orbital mechanics, safety protocols, and zero-gravity hospitality to give humankind multi-planetary freedom.
                </p>
            </div>
        </main>
    );
}