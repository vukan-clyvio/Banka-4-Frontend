import { useState }    from 'react';
import { cardsApi }    from '../../api/endpoints/cards';
import styles          from './UnblockCardModal.module.css';

export default function UnblockCardModal({ card, clientName, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await cardsApi.unblock(card.id);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.error ?? err?.message ?? 'Greška pri deblokadi kartice.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">

        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className={styles.title}>Deblokada kartice</h2>
          <button className={styles.btnClose} onClick={onClose} aria-label="Zatvori">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.question}>
            Da li ste sigurni da želite da deblokirate karticu?
          </p>

          <div className={styles.cardInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Klijent</span>
              <span className={styles.infoValue}>{clientName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Broj kartice</span>
              <span className={`${styles.infoValue} ${styles.mono}`}>{card.card_number}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Broj računa</span>
              <span className={`${styles.infoValue} ${styles.mono}`}>{card.account_number}</span>
            </div>
          </div>

          <p className={styles.note}>
            Ova akcija će biti zabeležena u audit logu sa vašim ID-em i trenutnim vremenom.
          </p>

          {error && (
            <div className={styles.errorBanner}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.btnCancel}
            onClick={onClose}
            disabled={loading}
          >
            Otkaži
          </button>
          <button
            className={styles.btnConfirm}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Deblokiram...' : 'Potvrdi deblokadu'}
          </button>
        </div>

      </div>
    </div>
  );
}
