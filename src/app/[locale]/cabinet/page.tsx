'use client';

import { useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { useSpace } from '@/context/SpaceContext';

export default function CabinetPage() {
    const t = useTranslations('Cabinet');
    const format = useFormatter();
    const { cart, myTickets, removeFromCart, processPayment } = useSpace();

    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length >= 2) {
            val = val.slice(0, 2) + '/' + val.slice(2);
        }
        setExpiry(val);
    };

    const validateForm = () => {
        const errs: { [key: string]: string } = {};

        if (!cardName.trim()) {
            errs.cardName = t('errors.cardNameRequired');
        }

        const cleanCardNum = cardNumber.replace(/\s/g, '');
        if (!/^\d{16}$/.test(cleanCardNum)) {
            errs.cardNumber = t('errors.cardNumberInvalid');
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            errs.expiry = t('errors.expiryInvalid');
        } else {
            const [monthStr, yearStr] = expiry.split('/');
            const month = parseInt(monthStr, 10);
            const year = 2000 + parseInt(yearStr, 10);

            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;

            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errs.expiry = t('errors.expiryExpired');
            }
        }

        if (!/^\d{3}$/.test(cvc)) {
            errs.cvc = t('errors.cvcInvalid');
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsProcessing(true);
        setPaymentSuccess(false);

        await processPayment();

        setIsProcessing(false);
        setPaymentSuccess(true);
        setCardName('');
        setCardNumber('');
        setExpiry('');
        setCvc('');
    };

    return (
        <main className="max-w-6xl mx-auto px-6 py-12 space-y-12 text-slate-100">
            <div className="space-y-2 border-b border-slate-800 pb-6">
                <h1 className="text-4xl font-extrabold text-indigo-300">{t('title')}</h1>
                <p className="text-slate-400">{t('subtitle')}</p>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span>{t('cartTitle')}</span>
                    <span className="text-xs px-2.5 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full">
            {cart.length}
          </span>
                </h2>

                {cart.length === 0 ? (
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center text-slate-500">
                        {t('cartEmpty')}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-lg text-indigo-300">{item.destName}</h3>
                                        <p className="text-sm text-slate-400">
                                            {t('passengers')} {item.passengers} | {item.cabinClass}
                                        </p>
                                        {item.discount > 0 && (
                                            <span className="inline-block text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                        {t('discount', { percent: item.discount })}
                      </span>
                                        )}
                                    </div>

                                    <div className="text-right space-y-2">
                                        <div className="text-xl font-black text-emerald-400">
                                            {format.number(item.totalPrice, { style: 'currency', currency: 'USD' })}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
                                        >
                                            {t('remove')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handlePay} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                            <h3 className="text-xl font-bold border-b border-slate-800 pb-3">{t('paymentTitle')}</h3>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 uppercase">{t('cardName')}</label>
                                <input
                                    type="text"
                                    value={cardName}
                                    placeholder="JOHN DOE"
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-sm text-white focus:outline-none focus:border-indigo-500 uppercase"
                                />
                                {errors.cardName && <p className="text-xs text-rose-400 mt-1">{errors.cardName}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-slate-400 uppercase">{t('cardNumber')}</label>
                                <input
                                    type="text"
                                    maxLength={19}
                                    value={cardNumber}
                                    placeholder="4111 2222 3333 4444"
                                    onChange={handleCardNumberChange}
                                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                                />
                                {errors.cardNumber && <p className="text-xs text-rose-400 mt-1">{errors.cardNumber}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 uppercase">{t('expiry')}</label>
                                    <input
                                        type="text"
                                        maxLength={5}
                                        value={expiry}
                                        placeholder="12/28"
                                        onChange={handleExpiryChange}
                                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                                    />
                                    {errors.expiry && <p className="text-xs text-rose-400 mt-1">{errors.expiry}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 uppercase">{t('cvc')}</label>
                                    <input
                                        type="password"
                                        maxLength={3}
                                        value={cvc}
                                        placeholder="123"
                                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                                        className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                                    />
                                    {errors.cvc && <p className="text-xs text-rose-400 mt-1">{errors.cvc}</p>}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800 space-y-3">
                                <div className="flex justify-between font-bold">
                                    <span>{t('total')}</span>
                                    <span className="text-emerald-400 text-lg">
                    {format.number(cartTotal, { style: 'currency', currency: 'USD' })}
                  </span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold rounded-lg transition flex items-center justify-center cursor-pointer"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>{t('processing')}</span>
                                        </div>
                                    ) : (
                                        t('payNow')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {paymentSuccess && (
                    <div className="p-4 bg-emerald-950 border border-emerald-500 text-emerald-300 rounded-xl text-center font-medium">
                        {t('paymentSuccess')}
                    </div>
                )}
            </section>

            <section className="space-y-6 pt-6 border-t border-slate-800">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span>{t('myTicketsTitle')}</span>
                    <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
            {myTickets.length}
          </span>
                </h2>

                {myTickets.length === 0 ? (
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center text-slate-500">
                        {t('noTickets')}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {myTickets.map((ticket) => (
                            <div key={ticket.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-indigo-300">{ticket.destName}</h3>
                                    <span className="text-xs font-mono text-slate-500">{ticket.purchaseDate}</span>
                                </div>
                                <div className="text-sm text-slate-400 space-y-1">
                                    <p>{t('passengers')} {ticket.passengers}</p>
                                    <p>{t('classLabel')} {ticket.cabinClass}</p>
                                </div>
                                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                                    <span className="text-slate-400">{t('paid')}</span>
                                    <span className="font-bold text-emerald-400">
                    {format.number(ticket.totalPrice, { style: 'currency', currency: 'USD' })}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}