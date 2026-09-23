'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations, useFormatter } from 'next-intl';
import { useSpace } from '@/context/SpaceContext';

const CABIN_MULTIPLIERS = { economy: 1.0, business: 1.8, vip: 3.0 };

export default function HomePage() {
  const t = useTranslations();
  const tBooking = useTranslations('Booking');
  const format = useFormatter();
  const { destinations, addToCart } = useSpace();
  const calculatorRef = useRef<HTMLDivElement>(null);

  const [selectedDestId, setSelectedDestId] = useState('moon');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business' | 'vip'>('economy');

  const [promoCode, setPromoCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [randomDisplayVal, setRandomDisplayVal] = useState<number | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isPromoUsed, setIsPromoUsed] = useState(false);
  const [promoStatus, setPromoStatus] = useState<{ type: 'success' | 'error' | 'alreadyUsed'; discount?: number } | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const savedDiscount = localStorage.getItem('user_promo_discount');
    if (savedDiscount) {
      const discountVal = parseFloat(savedDiscount);
      setAppliedDiscount(discountVal);
      setIsPromoUsed(true);
      setPromoStatus({ type: 'alreadyUsed' });
    }
  }, []);

  const selectedDestination = destinations.find((d) => d.id === selectedDestId) || destinations[1];

  const rawPrice = selectedDestination.basePrice * passengers * CABIN_MULTIPLIERS[cabinClass];
  const totalPrice = rawPrice * (1 - appliedDiscount);

  const handleApplyPromo = () => {
    if (isPromoUsed || appliedDiscount > 0) {
      setPromoStatus({ type: 'alreadyUsed' });
      return;
    }

    if (!promoCode.trim()) return;

    setIsValidating(true);
    setPromoStatus(null);

    const interval = setInterval(() => {
      setRandomDisplayVal(Math.floor(Math.random() * 11) + 5);
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      setIsValidating(false);

      if (promoCode.trim().toUpperCase() === 'GALACTIC2026') {
        const finalDiscount = Math.floor(Math.random() * 11) + 5;
        const discountDecimal = finalDiscount / 100;
        setRandomDisplayVal(finalDiscount);
        setAppliedDiscount(discountDecimal);
        setIsPromoUsed(true);
        localStorage.setItem('user_promo_discount', discountDecimal.toString());
        setPromoStatus({ type: 'success', discount: finalDiscount });
      } else {
        setRandomDisplayVal(null);
        setAppliedDiscount(0);
        setPromoStatus({ type: 'error' });
      }
    }, 2000);
  };

  const handleAddToCart = () => {
    addToCart({
      destId: selectedDestination.id,
      destName: selectedDestination.name,
      passengers,
      cabinClass: tBooking(`classOptions.${cabinClass}`),
      totalPrice,
      discount: appliedDiscount * 100,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  return (
      <main className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-12 max-w-6xl mx-auto">
        <section className="text-center space-y-4 py-8 border-b border-slate-800">
        <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-medium border border-indigo-500/20">
          {t('Hero.badge')}
        </span>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {t('Hero.title')}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{t('Hero.subtitle')}</p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold">{t('Destinations.title')}</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {destinations.map((dest) => (
                <div
                    key={dest.id}
                    className={`bg-slate-900 border rounded-xl p-6 space-y-4 flex flex-col justify-between transition ${
                        selectedDestId === dest.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-800'
                    }`}
                >
                  <div>
                    <h3 className="text-xl font-bold text-indigo-300">{dest.name}</h3>
                    <p className="text-sm font-semibold text-amber-400 mt-1">
                      {t('Destinations.ticketsLeft', { count: dest.ticketsLeft })}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      {t('Destinations.flightDuration', { days: dest.days })}
                    </p>
                    <p className="text-sm text-slate-400">
                      {t('Destinations.nextLaunch')}:{' '}
                      <span className="text-slate-200">
                    {format.dateTime(new Date(dest.launchDate), { dateStyle: 'medium' })}
                  </span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">{t('Destinations.priceFrom')}</span>
                      <span className="text-xl font-extrabold text-emerald-400">
                    {format.number(dest.basePrice, { style: 'currency', currency: 'USD' })}
                  </span>
                    </div>
                    <button
                        disabled={dest.ticketsLeft === 0}
                        onClick={() => {
                          setSelectedDestId(dest.id);
                          calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium rounded-lg transition cursor-pointer"
                    >
                      {t('Destinations.bookButton')}
                    </button>
                  </div>
                </div>
            ))}
          </div>
        </section>

        <section ref={calculatorRef} className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 backdrop-blur">
          <h3 className="text-2xl font-bold text-white">{t('Booking.title')}</h3>

          <div className="text-sm text-slate-300 bg-indigo-950/40 p-4 rounded-lg border border-indigo-900/50">
            {t.rich('Booking.promoNote', {
              b: (chunks) => <strong className="text-indigo-300">{chunks}</strong>,
              highlight: (chunks) => <span className="text-emerald-400 font-bold">{chunks}</span>,
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {t('Booking.passengers')}
              </label>
              <input
                  type="number"
                  min="1"
                  max={selectedDestination.ticketsLeft || 1}
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                {t('Booking.cabinClass')}
              </label>
              <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="economy">{t('Booking.classOptions.economy')}</option>
                <option value="business">{t('Booking.classOptions.business')}</option>
                <option value="vip">{t('Booking.classOptions.vip')}</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {tBooking('promoCode')}
            </label>
            <div className="flex gap-3">
              <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={isValidating || isPromoUsed}
                  placeholder={isPromoUsed ? tBooking('promoAppliedPlaceholder') : tBooking('promoPlaceholder')}
                  className="flex-1 p-3 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                  onClick={handleApplyPromo}
                  disabled={isValidating || !promoCode.trim() || isPromoUsed}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold rounded-lg transition flex items-center justify-center min-w-[140px] cursor-pointer disabled:cursor-not-allowed"
              >
                {isValidating ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-xs">{tBooking('spinning')}</span>
                    </div>
                ) : isPromoUsed ? (
                    tBooking('applied')
                ) : (
                    tBooking('submit')
                )}
              </button>
            </div>

            {isValidating && (
                <div className="flex items-center justify-between p-4 bg-indigo-950/80 border border-indigo-500 rounded-lg text-indigo-300">
                  <span className="text-sm">{tBooking('validating')}</span>
                  <span className="text-2xl font-mono font-black text-amber-400 animate-bounce">
                {randomDisplayVal}%
              </span>
                </div>
            )}

            {promoStatus && !isValidating && (
                <p className={`text-sm font-medium ${promoStatus.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {promoStatus.type === 'success' && tBooking('promoSuccess', { discount: promoStatus.discount })}
                  {promoStatus.type === 'error' && tBooking('promoError')}
                  {promoStatus.type === 'alreadyUsed' && tBooking('promoAlreadyUsed')}
                </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-sm text-slate-400 block">{t('Booking.subtotal')}</span>
              <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-400">
                {format.number(totalPrice, { style: 'currency', currency: 'USD' })}
              </span>
                {appliedDiscount > 0 && (
                    <span className="text-sm text-slate-500 line-through">
                  {format.number(rawPrice, { style: 'currency', currency: 'USD' })}
                </span>
                )}
              </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={selectedDestination.ticketsLeft === 0}
                className="w-full md:w-auto py-3 px-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold rounded-lg transition cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              {tBooking('addToCart')}
            </button>
          </div>

          {addedNotice && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-center rounded-lg text-sm font-medium">
                {tBooking('addedToCartNotice')}
              </div>
          )}
        </section>
      </main>
  );
}