// src/features/transfers/ConfirmTransfer.jsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import { transfersApi } from '../../api/endpoints/transfers';
import styles from './transfers.module.css';

export default function ConfirmTransfer() {
    //const pageRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useLocation();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // ✅ FIX 1: redirect ako nema state
    useEffect(() => {
        if (!state) {
            navigate('/transfers/new');
        }
    }, [state, navigate]);

    // ✅ FIX 2: zaštita od crash-a
    if (!state) return null;

    const {
        fromAccount,
        toAccount,
        amount,
        preview,
        userName,
    } = state;

    const numericAmount = parseFloat(amount) || 0;

    const isExchange = fromAccount.valuta !== toAccount.valuta;

    const finalAmount =
        preview?.finalAmount ?? numericAmount;

    const handleConfirm = async () => {
        setSubmitting(true);
        setError(null);

        try {
            await transfersApi.execute({
                fromAccountId: fromAccount.id,
                toAccountId: toAccount.id,
                amount: numericAmount,
            });

            setSuccess(true);

            setTimeout(() => {
                navigate('/transfers/history');
            }, 2000);

        } catch (err) {
            // ✅ FIX 3: pravi error iz mock-a
            const msg =
                err?.response?.data?.error ||
                err?.message ||
                'Greška pri izvršavanju transfera.';

            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/transfers/new', { state });
    };

    return (
        <div className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div className="page-anim">
                    <div className={styles.breadcrumb}>
                        <span>Transferi</span> › <span>Potvrda transfera</span>
                    </div>

                    <h1 className={styles.pageTitle}>Potvrdi transfer</h1>

                    <p className={styles.pageDesc}>
                        Proverite podatke pre izvršenja transakcije
                    </p>
                </div>

                {success ? (
                    <div className={`page-anim ${styles.successCard}`}>
                        <div className={styles.successIcon}>✅</div>
                        <h2>Transfer uspešno izvršen!</h2>
                        <p>Sredstva su prebačena na odabrani račun.</p>
                        <p>Preusmeravamo vas na istoriju transfera...</p>
                    </div>
                ) : (
                    <div className={`page-anim ${styles.confirmCard}`}>
                        <div className={styles.summaryGrid}>

                            {/* KLIJENT */}
                            <div className={styles.summaryItem}>
                                <span className={styles.label}>Klijent</span>
                                <span className={styles.value}>{userName}</span>
                            </div>

                            {/* FROM */}
                            <div className={styles.summaryItem}>
                                <span className={styles.label}>Iz računa</span>
                                <span className={styles.value}>
                                    {fromAccount.broj} ({fromAccount.valuta})
                                    <br />
                                    <small>
                                        Stanje: {fromAccount.stanje.toLocaleString('sr-RS')} {fromAccount.valuta}
                                    </small>
                                </span>
                            </div>

                            {/* TO */}
                            <div className={styles.summaryItem}>
                                <span className={styles.label}>Na račun</span>
                                <span className={styles.value}>
                                    {toAccount.broj} ({toAccount.valuta})
                                    <br />
                                    <small>
                                        Stanje: {toAccount.stanje.toLocaleString('sr-RS')} {toAccount.valuta}
                                    </small>
                                </span>
                            </div>

                            {/* IZNOS */}
                            <div className={styles.summaryItem}>
                                <span className={styles.label}>Iznos za skidanje</span>
                                <span className={styles.valueBig}>
                                    {numericAmount.toLocaleString('sr-RS', {
                                        minimumFractionDigits: 2,
                                    })} {fromAccount.valuta}
                                </span>
                            </div>

                            {/* MENJAČKA LOGIKA */}
                            {isExchange && preview && (
                                <>
                                    <div className={styles.summaryItem}>
                                        <span className={styles.label}>Kurs</span>
                                        <span className={styles.value}>
                                            1 {fromAccount.valuta} = {Number(preview.kurs).toFixed(4)} {toAccount.valuta}
                                        </span>
                                    </div>

                                    <div className={styles.summaryItem}>
                                        <span className={styles.label}>Provizija</span>
                                        <span className={styles.value}>
                                            {preview.commission?.toLocaleString('sr-RS', {
                                                minimumFractionDigits: 2,
                                            })} {fromAccount.valuta}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* FINAL */}
                            <div className={`${styles.summaryItem} ${styles.finalRow}`}>
                                <span className={styles.label}>
                                    Konačni iznos koji stiže
                                </span>

                                <span className={styles.finalAmount}>
                                    {Number(finalAmount).toLocaleString('sr-RS', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} {toAccount.valuta}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <Alert
                                tip="greska"
                                poruka={error}
                                style={{ margin: '20px 0' }}
                            />
                        )}

                        <div className={styles.actions}>
                            <button
                                className={styles.btnSecondary}
                                onClick={handleBack}
                                disabled={submitting}
                            >
                                Nazad – izmeni
                            </button>

                            <button
                                className={styles.btnPrimary}
                                onClick={handleConfirm}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <Spinner size="small" inline /> Potvrđujem...
                                    </>
                                ) : (
                                    'Potvrdi transfer'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}