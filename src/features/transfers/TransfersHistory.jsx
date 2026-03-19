// src/features/transfers/TransfersHistory.jsx
import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { transfersApi } from '../../api/endpoints/transfers';
import { useAuthStore } from '../../store/authStore';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './transfers.module.css';
import TransferRowDetailModal from "./TransferRowDetailModal.jsx";
import gsap from "gsap";

export default function TransfersHistory() {
    const pageRef = useRef(null);
    const navigate = useNavigate();
    const clientId = useAuthStore(s => s.user?.id);

    const { data: transfersRes, loading, error } =
        useFetch(() => transfersApi.getHistory(clientId), [clientId]);



    const transfers = useMemo(() => {
        return transfersRes?.data || [];
    }, [transfersRes]);

    const [selectedTransfer, setSelectedTransfer] = useState(null);

    useLayoutEffect(() => {
        if (!pageRef.current) return;

        const ctx = gsap.context(() => {
            const elements = gsap.utils.toArray('.page-anim');

            if (!elements.length) return;

            gsap.from(elements, {
                opacity: 0,
                y: 20,
                duration: 0.45,
                stagger: 0.08,
                ease: 'power2.out',
            });
        }, pageRef);

        return () => ctx.revert();
    }, [transfers]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatAmount = (amount, currency) => {
        return Number(amount || 0).toLocaleString('sr-RS', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + ' ' + currency;
    };

    const getStatusIcon = (status) => {
        if (status === 'SUCCESS' || status === 'uspešno') return '✅';
        if (status === 'FAILED' || status === 'neuspešno') return '❌';
        return '⏳';
    };

    if (loading) return <Spinner />;
    if (error) return <Alert tip="greska" poruka="Ne mogu da učitam istoriju transfera" />;

    return (
        <div ref={pageRef} className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div className="page-anim">
                    <div className={styles.breadcrumb}>
                        <span>Transferi</span> › <span className={styles.breadcrumbActive}>Istorija transfera</span>
                    </div>
                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>Istorija transfera</h1>
                            <p className={styles.pageDesc}>
                                Pregled svih internih prenosa između vaših računa
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`page-anim ${styles.tableCard}`}>
                    {transfers?.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Nema evidentiranih transfera još uvek.</p>
                            <button
                                className={styles.btnPrimary}
                                onClick={() => navigate('/transfers/new')}
                            >
                                Kreiraj novi transfer
                            </button>
                        </div>
                    ) : (
                        <div className={styles.tableWrapper}>
                            <table className={styles.historyTable}>
                                <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Sa računa → Na račun</th>
                                    <th>Početni iznos</th>
                                    <th>Krajnji iznos</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transfers.map((t) => (
                                    <tr
                                        key={t.transfer_id ?? t.id ?? t.transactionId}
                                        className={styles.row}
                                        onClick={() => setSelectedTransfer(t)}
                                    >
                                        <td>{formatDate(t.created_at ?? t.date)}</td>
                                        <td>
                                            <div className={styles.accountPair}>
                                                <span className={styles.fromAcc}>{t.from_account_number ?? t.fromAccountNumber}</span>
                                                <span className={styles.arrow}>→</span>
                                                <span className={styles.toAcc}>{t.to_account_number ?? t.toAccountNumber}</span>
                                            </div>
                                        </td>
                                        <td className={styles.amountCell}>
                                            {formatAmount(t.initial_amount ?? t.initialAmount, t.exchange_rate ? '' : '')}
                                        </td>
                                        <td className={styles.amountCell}>
                                            {formatAmount(t.final_amount ?? t.finalAmount, '')}
                                        </td>
                                        <td>
                        <span className={styles.status}>
                          {getStatusIcon(t.status)}
                            <span className={styles.statusText}>{t.status || 'Uspešno'}</span>
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal za detalje transfera */}
            {selectedTransfer && (
                <TransferRowDetailModal
                    transfer={selectedTransfer}
                    onClose={() => setSelectedTransfer(null)}
                />
            )}
        </div>
    );
}