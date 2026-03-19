// src/features/transfers/CreateTransfer.jsx
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { clientApi } from '../../api/endpoints/client';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './transfers.module.css';
import { useAuthStore } from '../../store/authStore';

function fmt(amount, currency) {
    return Number(amount || 0).toLocaleString('sr-RS', { minimumFractionDigits: 2 }) + ' ' + (currency ?? '');
}

export default function CreateTransfer() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const user = useAuthStore(s => s.user);
    const clientId = user?.id;

    const { data: accountsRes, loading, error } =
        useFetch(() => clientApi.getAccounts(clientId), [clientId]);

    const accounts = accountsRes?.data ?? [];

    const [fromAccNum, setFromAccNum] = useState('');
    const [toAccNum,   setToAccNum]   = useState('');
    const [amount,     setAmount]     = useState('');

    const fromAccount = accounts.find(a => (a.account_number ?? a.number) === fromAccNum) ?? null;
    const toAccount   = accounts.find(a => (a.account_number ?? a.number) === toAccNum)   ?? null;

    const parsedAmount = parseFloat(amount);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.page-anim', {
                opacity: 0, y: 24, duration: 0.45, stagger: 0.08, ease: 'power2.out',
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    // Reset TO when FROM changes
    useEffect(() => { setToAccNum(''); }, [fromAccNum]);

    const canProceed =
        fromAccount &&
        toAccount &&
        fromAccNum !== toAccNum &&
        !isNaN(parsedAmount) &&
        parsedAmount > 0 &&
        parsedAmount <= (fromAccount?.balance ?? Infinity);

    const handleNext = () => {
        if (!canProceed) return;
        navigate('/transfers/confirm', {
            state: {
                fromAccount,
                toAccount,
                amount: parsedAmount,
                userName: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim(),
            },
        });
    };

    if (loading) return <Spinner />;
    if (error) return <Alert tip="greska" poruka="Ne mogu da učitam račune" />;

    return (
        <div ref={pageRef} className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div>
                    <div className={styles.breadcrumb}>Transferi › Novi transfer</div>
                    <button className={styles.back} onClick={() => navigate('/dashboard')}>← Nazad</button>
                    <h1 className={styles.pageTitle}>Kreiraj transfer</h1>
                </div>

                <div className={`page-anim ${styles.card}`}>

                    {/* FROM */}
                    <div className={styles.field}>
                        <label>Izvor račun</label>
                        <select value={fromAccNum} onChange={e => setFromAccNum(e.target.value)}>
                            <option value="">Izaberi račun...</option>
                            {accounts.map(acc => {
                                const num = acc.account_number ?? acc.number;
                                return (
                                    <option key={num} value={num}>
                                        {acc.name ?? num} — {fmt(acc.balance, acc.currency)}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* TO */}
                    <div className={styles.field}>
                        <label>Odredišni račun</label>
                        <select value={toAccNum} onChange={e => setToAccNum(e.target.value)}>
                            <option value="">Izaberi račun...</option>
                            {accounts
                                .filter(a => (a.account_number ?? a.number) !== fromAccNum)
                                .map(acc => {
                                    const num = acc.account_number ?? acc.number;
                                    return (
                                        <option key={num} value={num}>
                                            {acc.name ?? num} — {fmt(acc.balance, acc.currency)}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>

                    {/* IZNOS */}
                    <div className={styles.field}>
                        <label>Iznos</label>
                        <input
                            type="number"
                            step="any"
                            min="0"
                            max={fromAccount?.balance ?? undefined}
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <button className={styles.btnPrimary} onClick={handleNext} disabled={!canProceed}>
                        Pregledaj i potvrdi transfer
                    </button>
                </div>
            </main>
        </div>
    );
}