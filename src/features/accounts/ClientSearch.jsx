import styles from './ClientSearch.module.css';
import { useState } from 'react';

export default function ClientSearch({ onSearch, searchStatus }) {
  const [query, setQuery] = useState('');

  const isSearching = searchStatus === 'searching';

  function handleClick() {
    const q = query.trim();
    if (q) onSearch(q);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <span className={styles.sectionTitle}>Identifikacija klijenta</span>
      </div>

      <p className={styles.hint}>
        Unesite JMBG ili email adresu klijenta. Ako klijent postoji u sistemu, podaci će biti automatski učitani.
      </p>

      <div className={styles.searchRow}>
        <div className={styles.fieldGrow}>
          <label className={styles.label}>
            JMBG ili email adresa <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="npr. 0306025710001 ili marko@email.com"
            className={styles.input}
            disabled={isSearching}
          />
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={isSearching || !query.trim()}
          className={styles.btnSearch}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          {isSearching ? 'Pretraga...' : 'Pretraži'}
        </button>
      </div>

      {searchStatus === 'not_found' && (
        <p className={styles.statusNotFound}>
          Klijent nije pronađen — unesite podatke za kreiranje novog klijenta.
        </p>
      )}
      {searchStatus === 'found' && (
        <p className={styles.statusFound}>
          Klijent pronađen u sistemu.
        </p>
      )}
    </div>
  );
}
