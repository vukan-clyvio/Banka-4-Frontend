// src/features/exchange/RatesList.jsx
import { useRef, useLayoutEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { exchangeApi } from '../../api/endpoints/exchange';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import ExchangeTable from './ExchangeTable';
import styles from './RatesList.module.css';
import gsap from 'gsap';

export default function RatesList() {
    const pageRef = useRef(null);
    const { data, loading, error } = useFetch(() => exchangeApi.getRates());

    useLayoutEffect(() => {
        if (!data) return;
        const ctx = gsap.context(() => {
            gsap.from('.page-anim', {
                opacity: 0,
                y: 20,
                duration: 0.45,
                stagger: 0.08,
                ease: 'power2.out',
            });
        }, pageRef);
        return () => ctx.revert();
    }, [data]);

    if (loading) return <Spinner />;
    if (error)   return <Alert tip="greska" poruka={error.message || 'Ne mogu da učitam kursnu listu.'} />;
    if (!data)   return null;

    return (
        <div ref={pageRef} className={styles.stranica}>
            <main className={styles.sadrzaj}>
                <div className="page-anim">
                    <div className={styles.breadcrumb}>
                        <span>Devizni poslovi</span>
                        <span className={styles.breadcrumbSep}>›</span>
                        <span className={styles.breadcrumbActive}>Kursna lista</span>
                    </div>

                    <div className={styles.pageHeader}>
                        <div>
                            <h1 className={styles.pageTitle}>Kursna lista</h1>
                            <p className={styles.pageDesc}>
                                Srednji kursevi – ažurirano {new Date().toLocaleDateString('sr-RS')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`page-anim ${styles.tableCard}`}>
                    <ExchangeTable rates={data} />
                </div>
            </main>
        </div>
    );
}