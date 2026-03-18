// src/features/transfers/TransferRowDetailModal.jsx
import { useRef } from 'react';

import styles from './transfers.module.css'; // koristi isti modul kao ostale stranice

export default function TransferRowDetailModal({ transfer, onClose }) {
    const modalRef = useRef(null);

    // Animacija ulaska (fade + slide)
    // useLayoutEffect(() => {
    //     const ctx = gsap.context(() => {
    //         gsap.from(modalRef.current, {
    //             opacity: 0,
    //             y: 40,
    //             duration: 0.4,
    //             ease: 'power2.out',
    //         });
    //     }, modalRef);
    //
    //     return () => ctx.revert();
    // }, []);

    if (!transfer) return null;

    const {
        date,
        createdAt,
        fromAccountNumber,
        fromCurrency,
        toAccountNumber,
        toCurrency,
        initialAmount,
        finalAmount,
        commission = 0,
        exchangeRate,
        transactionId,
        status = 'Uspešno',
    } = transfer;

    const formatDateTime = (dt) => {
        return new Date(dt || date).toLocaleString('sr-RS', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatMoney = (amt, curr) =>
        amt.toLocaleString('sr-RS', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) + ' ' + curr;

    const isExchange = fromCurrency !== toCurrency;

    const getStatusClass = (st) => {
        if (st?.toLowerCase().includes('uspeš') || st === 'SUCCESS') return styles.statusSuccess;
        if (st?.toLowerCase().includes('neuspeš') || st === 'FAILED') return styles.statusFailed;
        return styles.statusPending;
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                ref={modalRef}
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>

                <h2 className={styles.modalTitle}>Detalji transfera</h2>

                <div className={styles.modalBody}>
                    <div className={styles.modalRow}>
                        <div className={styles.modalLabel}>Datum i vreme</div>
                        <div>{formatDateTime(createdAt || date)}</div>
                    </div>

                    <div className={styles.modalRow}>
                        <div className={styles.modalLabel}>Sa računa</div>
                        <div>
                            {fromAccountNumber} <span className={styles.currencyTag}>({fromCurrency})</span>
                        </div>
                    </div>

                    <div className={styles.modalRow}>
                        <div className={styles.modalLabel}>Na račun</div>
                        <div>
                            {toAccountNumber} <span className={styles.currencyTag}>({toCurrency})</span>
                        </div>
                    </div>

                    <div className={styles.modalRow}>
                        <div className={styles.modalLabel}>Iznos skinut</div>
                        <div className={styles.modalAmountOutgoing}>
                            {formatMoney(initialAmount, fromCurrency)}
                        </div>
                    </div>

                    {isExchange && exchangeRate && (
                        <>
                            <div className={styles.modalRow}>
                                <div className={styles.modalLabel}>Primijenjeni kurs</div>
                                <div>
                                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                                </div>
                            </div>

                            <div className={styles.modalRow}>
                                <div className={styles.modalLabel}>Provizija</div>
                                <div className={styles.modalCommission}>
                                    {formatMoney(commission, fromCurrency)}
                                </div>
                            </div>
                        </>
                    )}

                    <div className={`${styles.modalRow} ${styles.modalFinalRow}`}>
                        <div className={styles.modalLabel}>Konačno primljeno</div>
                        <div className={styles.modalFinalAmount}>
                            {formatMoney(finalAmount, toCurrency)}
                        </div>
                    </div>

                    {transactionId && (
                        <div className={styles.modalRow}>
                            <div className={styles.modalLabel}>Broj transakcije / Referenca</div>
                            <div className={styles.monoText}>{transactionId}</div>
                        </div>
                    )}

                    <div className={styles.modalRow}>
                        <div className={styles.modalLabel}>Status</div>
                        <div className={`${styles.modalStatus} ${getStatusClass(status)}`}>
                            {status}
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.btnSecondary} onClick={onClose}>
                        Zatvori
                    </button>
                </div>
            </div>
        </div>
    );
}