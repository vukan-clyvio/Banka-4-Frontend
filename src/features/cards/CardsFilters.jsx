import styles from './CardsFilters.module.css';

export default function CardsFilters({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className={styles.filtersCard}>
      <div className={styles.filtersGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Ime</label>
          <input
            type="text"
            placeholder="Pretraži po imenu..."
            value={filters.first_name}
            onChange={e => update('first_name', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Prezime</label>
          <input
            type="text"
            placeholder="Pretraži po prezimenu..."
            value={filters.last_name}
            onChange={e => update('last_name', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>JMBG</label>
          <input
            type="text"
            placeholder="Pretraži po JMBG..."
            value={filters.jmbg}
            onChange={e => update('jmbg', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Broj računa</label>
          <input
            type="text"
            placeholder="Pretraži po broju računa..."
            value={filters.account_number}
            onChange={e => update('account_number', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}
