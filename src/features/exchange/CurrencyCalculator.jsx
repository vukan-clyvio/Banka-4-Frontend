// src/features/exchange/CurrencyCalculator.jsx
import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { exchangeApi } from '../../api/endpoints/exchange';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './CurrencyCalculator.module.css';
import gsap from 'gsap';

const FLAG_EMOJI = {
    RSD: '🇷🇸', EUR: '🇪🇺', CHF: '🇨🇭', USD: '🇺🇸', GBP: '🇬🇧',
    JPY: '🇯🇵', CAD: '🇨🇦', AUD: '🇦🇺',
};

export default function CurrencyCalculator() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const { data: ratesData, loading, error } = useFetch(() => exchangeApi.getRates(), []);

    const rates = Array.isArray(ratesData?.rates) ? ratesData.rates
        : Array.isArray(ratesData) ? ratesData : [];

    // Build currency list: RSD + all from rates
    const currencies = useMemo(() => {
        const codes = ['RSD', ...rates.map(r => r.code ?? r.currency)];
        return [...new Set(codes)];
    }, [rates]);

    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('EUR');
    const [toCurrency, setToCurrency] = useState('RSD');

    // Real-time dynamic calculation using buy/sell rates
    const result = useMemo(() => {
        if (!rates.length || !amount || amount <= 0) return 0;

        // Helper: get RSD value for a given currency amount
        function toRSD(cur, val) {
            if (cur === 'RSD') return val;
            const rate = rates.find(r => (r.code ?? r.currency) === cur);
            if (!rate) return 0;
            // Client sells foreign currency to bank → bank buys → use buy_rate
            const buyRate = rate.buy ?? rate.buy_rate ?? 0;
            return val * buyRate;
        }

        // Helper: convert from RSD to target currency
        function fromRSD(cur, val) {
            if (cur === 'RSD') return val;
            const rate = rates.find(r => (r.code ?? r.currency) === cur);
            if (!rate) return 0;
            // Client buys foreign currency from bank → bank sells → use sell_rate
            const sellRate = rate.sell ?? rate.sell_rate ?? 0;
            return sellRate > 0 ? val / sellRate : 0;
        }

        const rsdValue = toRSD(fromCurrency, amount);
        return fromRSD(toCurrency, rsdValue);
    }, [amount, fromCurrency, toCurrency, rates]);

    // Applied rate label
    const rateLabel = useMemo(() => {
        if (fromCurrency === toCurrency || !rates.length) return null;
        if (fromCurrency === 'RSD') {
            const rate = rates.find(r => (r.code ?? r.currency) === toCurrency);
            const sell = rate?.sell ?? rate?.sell_rate;
            return sell ? `1 ${toCurrency} = ${sell.toFixed(2)} RSD (prodajni)` : null;
        }
        if (toCurrency === 'RSD') {
            const rate = rates.find(r => (r.code ?? r.currency) === fromCurrency);
            const buy = rate?.buy ?? rate?.buy_rate;
            return buy ? `1 ${fromCurrency} = ${buy.toFixed(2)} RSD (kupovni)` : null;
        }
        // Cross: foreign → foreign via RSD
        const fromRate = rates.find(r => (r.code ?? r.currency) === fromCurrency);
        const toRate = rates.find(r => (r.code ?? r.currency) === toCurrency);
        const buy = fromRate?.buy ?? fromRate?.buy_rate;
        const sell = toRate?.sell ?? toRate?.sell_rate;
        if (buy && sell) return `${fromCurrency} → RSD (kupovni: ${buy.toFixed(2)}) → ${toCurrency} (prodajni: ${sell.toFixed(2)})`;
        return null;
    }, [fromCurrency, toCurrency, rates]);

    useLayoutEffect(() => {
        if (!rates.length) return;
        const ctx = gsap.context(() => {
            gsap.from('.page-anim', {
                opacity: 0,
                y: 20,
                duration: 0.45,
                stagger: 0.1,
                ease: 'power2.out',
            });
        }, pageRef);
        return () => ctx.revert();
    }, [rates]);

    if (loading) return <Spinner />;
    if (error)   return <Alert tip="greska" poruka={error.message || 'Ne mogu da učitam kurseve.'} />;
    if (!rates.length) return null;

    return (
        <div ref={pageRef} className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div className="page-anim">
                    <div className={styles.breadcrumb}>
                        <span>Menjačnica</span>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span className={styles.breadcrumbActive}>Kalkulator valuta</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <div>
                            <button className={styles.backBtn} onClick={() => navigate('/client/exchange')}>← Nazad</button>
                            <h1 className={styles.pageTitle}>Kalkulator valuta</h1>
                            <p className={styles.pageDesc}>
                                Proveri ekvivalentnost — rezultat se ažurira u realnom vremenu.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`page-anim ${styles.calculatorCard}`}>
                    <div className={styles.calculatorGrid}>
                        <div className={`${styles.field} ${styles.amountField}`}>
                            <label>Iznos</label>
                            <input
                                type="number"
                                min="0.01"
                                step="any"
                                value={amount}
                                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Iz valute</label>
                            <select
                                value={fromCurrency}
                                onChange={e => setFromCurrency(e.target.value)}
                            >
                                {currencies.map(c => (
                                    <option key={c} value={c}>
                                        {FLAG_EMOJI[c] ?? ''} {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>U valutu</label>
                            <select
                                value={toCurrency}
                                onChange={e => setToCurrency(e.target.value)}
                            >
                                {currencies.map(c => (
                                    <option key={c} value={c}>
                                        {FLAG_EMOJI[c] ?? ''} {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.resultBlock}>
                        <div className={styles.resultValue}>
                            {result.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            <span className={styles.resultCurrency}>{toCurrency}</span>
                        </div>
                        <div className={styles.resultSub}>
                            {amount > 0 ? `${amount.toLocaleString('sr-RS')} ${fromCurrency}` : '—'}
                        </div>
                        {rateLabel && (
                            <div className={styles.rateInfo}>{rateLabel}</div>
                        )}
                        <button
                            className={styles.btnPrimary}
                            style={{ width: '100%', marginTop: '24px' }}
                            onClick={() => navigate('/transfers/new', {
                                state: {
                                    prefilledAmount: amount,
                                    prefilledFromCurrency: fromCurrency,
                                    prefilledToCurrency: toCurrency
                                }
                            })}
                        >
                            Izvrši zamenu
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}