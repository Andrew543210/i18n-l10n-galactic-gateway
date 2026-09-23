import { useTranslations } from 'next-intl';

export default function AboutPage() {
    const t = useTranslations('About');
    const tHero = useTranslations('Hero');

    const stats = [
        { value: '100+', label: t('stats.launches') },
        { value: '99.9%', label: t('stats.safety') },
        { value: '3', label: t('stats.outposts') },
        { value: '15,000+', label: t('stats.travelers') },
    ];

    const scientificPillars = [
        {
            title: t('pillars.astrobiology.title'),
            desc: t('pillars.astrobiology.desc'),
            icon: '🌱',
        },
        {
            title: t('pillars.quantum.title'),
            desc: t('pillars.quantum.desc'),
            icon: '⚛️',
        },
        {
            title: t('pillars.orbital.title'),
            desc: t('pillars.orbital.desc'),
            icon: '🛰️',
        },
    ];

    return (
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-16 text-slate-100">
            <section className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold border border-indigo-500/20 tracking-wider uppercase">
          {t('sectorBadge')}
        </span>
                <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-200 via-white to-purple-400 bg-clip-text text-transparent">
                    {t('title')}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    {tHero('subtitle')}
                </p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur">
                {stats.map((item, idx) => (
                    <div key={idx} className="text-center space-y-1 p-2">
                        <div className="text-3xl font-extrabold text-indigo-400">{item.value}</div>
                        <div className="text-xs text-slate-400 uppercase font-medium">{item.label}</div>
                    </div>
                ))}
            </section>

            <section className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">{t('pillarsTitle')}</h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">{t('pillarsSubtitle')}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {scientificPillars.map((pillar, idx) => (
                        <div
                            key={idx}
                            className="p-6 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl space-y-4 transition group hover:shadow-lg hover:shadow-indigo-500/10"
                        >
                            <div className="text-4xl p-3 bg-slate-950 rounded-lg w-fit border border-slate-800 group-hover:scale-110 transition-transform">
                                {pillar.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-100">{pillar.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="p-8 bg-gradient-to-b from-indigo-950/20 to-slate-900/80 border border-indigo-900/40 rounded-2xl space-y-6">
                <h3 className="text-2xl font-bold text-center text-indigo-300">
                    {t('roadmapTitle')}
                </h3>

                <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2 border-l-2 border-indigo-500 pl-4">
                        <span className="text-indigo-400 font-mono font-bold">2026 – 2027</span>
                        <h4 className="font-semibold text-slate-200">{t('roadmap.phase1Title')}</h4>
                        <p className="text-slate-400">{t('roadmap.phase1Desc')}</p>
                    </div>

                    <div className="space-y-2 border-l-2 border-purple-500 pl-4">
                        <span className="text-purple-400 font-mono font-bold">2028 – 2029</span>
                        <h4 className="font-semibold text-slate-200">{t('roadmap.phase2Title')}</h4>
                        <p className="text-slate-400">{t('roadmap.phase2Desc')}</p>
                    </div>

                    <div className="space-y-2 border-l-2 border-emerald-500 pl-4">
                        <span className="text-emerald-400 font-mono font-bold">2030+</span>
                        <h4 className="font-semibold text-slate-200">{t('roadmap.phase3Title')}</h4>
                        <p className="text-slate-400">{t('roadmap.phase3Desc')}</p>
                    </div>
                </div>
            </section>
        </main>
    );
}