import React, { useState, useEffect } from 'react';
import { loansApi } from '../api/endpoints/loans';
import LoanList from '../features/loans/LoanList';
import LoanDetails from '../features/loans/LoanDetails';
import LoanRequestForm from '../features/loans/LoanRequestForm';
import Spinner from '../components/ui/Spinner'; 
import Alert from '../components/ui/Alert';     
import styles from './Loans.module.css';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    loansApi.getAll()
      .then(res => {
        setLoans(res.data);
        if (res.data.length > 0) {
          setSelectedLoan(res.data[0]);
        }
      })
      .catch(err => {
        console.error("Greška:", err);
        setError("Nije moguće učitati podatke o kreditima.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Obrisan "if (loading) return..." sa vrha da ne bi blokirao celu stranicu

  return (
    <div className={styles.loansPage}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTitle}>
          <h1>{showRequestForm ? "Zahtev za novi kredit" : "Pregled aktivnih kredita"}</h1>
          <p>{showRequestForm ? "Popunite formu ispod za brzu simulaciju" : "Master-Detail prikaz vaših zaduženja"}</p>
        </div>
        
        <button 
          className={showRequestForm ? styles.backBtn : styles.actionBtn}
          onClick={() => setShowRequestForm(!showRequestForm)}
        >
          {showRequestForm ? "← Nazad na pregled" : "+ Podnesi zahtev za kredit"}
        </button>
      </header>

      {/* GLAVNI SADRŽAJ */}
      <div className={styles.contentArea}>
        {showRequestForm ? (
          <div className={styles.formWrapper}>
            <LoanRequestForm />
          </div>
        ) : (
          /* Ovde proveravamo loading SAMO za Master-Detail deo */
          <>
            {loading ? (
              <div className={styles.center}><Spinner /></div>
            ) : error ? (
              <div className={styles.center}><Alert type="error" message={error} /></div>
            ) : (
              <div className={styles.layout}>
                <aside className={styles.masterSide}>
                  <LoanList 
                    loans={loans} 
                    selectedId={selectedLoan?.id} 
                    onSelectLoan={setSelectedLoan} 
                  />
                </aside>

                <main className={styles.detailSide}>
                  {selectedLoan ? (
                    <LoanDetails loan={selectedLoan} />
                  ) : (
                    <div className={styles.emptyState}>
                      <p>Izaberite kredit sa leve strane.</p>
                    </div>
                  )}
                </main>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}