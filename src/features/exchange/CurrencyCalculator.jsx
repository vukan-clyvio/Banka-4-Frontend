// src/features/exchange/CurrencyCalculator.jsx
import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { exchangeApi } from '../../api/endpoints/exchange';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './CurrencyCalculator.module.css';
import gsap from 'gsap';

export default function CurrencyCalculator() {
    const pageRef = useRef(null);
    const { data, loading, error } = useFetch(() => exchangeApi.getRates());

    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('EUR');
    const [toCurrency, setToCurrency] = useState('USD');

    const result = useMemo(() => {
        if (!data || amount <= 0) return 0;
        const fromRate = data.find(d => d.code === fromCurrency)?.mid || 1;
        const toRate   = data.find(d => d.code === toCurrency)?.mid   || 1;
        return (amount / fromRate) * toRate;
    }, [amount, fromCurrency, toCurrency, data]);

    useLayoutEffect(() => {
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
    }, [data]);

    if (loading) return <Spinner />;
    if (error)   return <Alert tip="greska" poruka={error.message || 'Ne mogu da učitam kurseve.'} />;
    if (!data)   return null;

    return (
        <div ref={pageRef} className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div className="page-anim">
                    <div className={styles.breadcrumb}>
                        <span>Devizni poslovi</span>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span className={styles.breadcrumbActive}>Kalkulator valuta</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>Kalkulator valuta</h1>
                            <p className={styles.pageDesc}>
                                Trenutni srednji kursevi – izračunajte iznos u drugoj valuti.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`page-anim ${styles.calculatorCard}`}>
                    <div className={styles.calculatorGrid}>
                        <div className={styles.field}>
                            <label>Iznos</label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                                className={amount > 0 ? styles.hasValue : ''}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>Iz valute</label>
                            <select
                                value={fromCurrency}
                                onChange={e => setFromCurrency(e.target.value)}
                            >
                                {data.map(d => (
                                    <option key={d.code} value={d.code}>
                                        {d.code}
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
                                {data.map(d => (
                                    <option key={d.code} value={d.code}>
                                        {d.code}
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
                            ≈ {amount.toLocaleString('sr-RS')} {fromCurrency}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}