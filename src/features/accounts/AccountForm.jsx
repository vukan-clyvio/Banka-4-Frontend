import styles from './AccountForm.module.css';

export const ACCOUNT_TYPES = [
  {
    value: 'tekuci',
    label: 'Tekući račun',
    desc:  'Standardni račun za svakodnevne transakcije (RSD)',
  },
  {
    value: 'devizni',
    label: 'Devizni račun',
    desc:  'Račun u stranoj valuti (EUR, USD, CHF…)',
  },
];

export const CURRENCIES = {
  tekuci:  [{ value: 'RSD', label: 'RSD' }],
  devizni: [
    { value: 'EUR', label: 'EUR' },
    { value: 'CHF', label: 'CHF' },
    { value: 'USD', label: 'USD' },
    { value: 'GBP', label: 'GBP' },
    { value: 'JPY', label: 'JPY' },
    { value: 'CAD', label: 'CAD' },
    { value: 'AUD', label: 'AUD' },
  ],
};

export const ACCOUNT_CATEGORIES = [
  { group: 'Lični računi',    value: 'licni_standardni',    label: 'Standardni' },
  { group: 'Lični računi',    value: 'licni_stedni',         label: 'Štedni' },
  { group: 'Lični računi',    value: 'licni_penzionerski',   label: 'Penzionerski' },
  { group: 'Lični računi',    value: 'licni_mladi',          label: 'Za mlade / studente' },
  { group: 'Poslovni računi', value: 'poslovni_doo',         label: 'D.O.O.' },
  { group: 'Poslovni računi', value: 'poslovni_ad',          label: 'A.D.' },
  { group: 'Poslovni računi', value: 'poslovni_fondacija',   label: 'Fondacija' },
];


export default function AccountForm({ form, onChange, errors }) {
  const currencies = form.account_type ? CURRENCIES[form.account_type] : [];

  const licni    = ACCOUNT_CATEGORIES.filter(c => c.group === 'Lični računi');
  const poslovni = ACCOUNT_CATEGORIES.filter(c => c.group === 'Poslovni računi');

  return (
    <>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <span className={styles.sectionTitle}>Tip i valuta računa</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Tip računa <span className={styles.required}>*</span>
          </label>
          <div className={styles.radioGroup}>
            {ACCOUNT_TYPES.map(type => (
              <label
                key={type.value}
                className={`${styles.radioOption} ${form.account_type === type.value ? styles.radioSelected : ''}`}
              >
                <input
                  type="radio"
                  name="account_type"
                  value={type.value}
                  checked={form.account_type === type.value}
                  onChange={e => onChange('account_type', e.target.value)}
                />
                <div>
                  <div className={styles.radioLabel}>{type.label}</div>
                  <div className={styles.radioDesc}>{type.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.account_type && <span className={styles.greska}>{errors.account_type}</span>}
        </div>

        {form.account_type && (
          <div className={styles.field} style={{ marginTop: '20px' }}>
            <label className={styles.label}>
              Valuta <span className={styles.required}>*</span>
            </label>
            <div className={styles.currencyGrid}>
              {currencies.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onChange('currency', c.value)}
                  className={`${styles.currencyOpt} ${form.currency === c.value ? styles.currencySelected : ''}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {errors.currency && <span className={styles.greska}>{errors.currency}</span>}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
              <path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          </div>
          <span className={styles.sectionTitle}>Kategorija računa</span>
        </div>

        <div className={styles.fieldGrid2}>
          <div className={styles.field}>
            <label className={styles.label}>
              Vrsta računa <span className={styles.required}>*</span>
            </label>
            <select
              value={form.category}
              onChange={e => onChange('category', e.target.value)}
              className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
            >
              <option value="">Izaberite kategoriju...</option>
              <optgroup label="Lični računi">
                {licni.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </optgroup>
              <optgroup label="Poslovni računi">
                {poslovni.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </optgroup>
            </select>
            {errors.category && <span className={styles.greska}>{errors.category}</span>}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span className={styles.sectionTitle}>Parametri i opcije</span>
        </div>

        <div className={styles.fieldGrid2}>
          <div className={styles.field}>
            <label className={styles.label}>
              Početno stanje <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={form.initial_balance}
              onChange={e => onChange('initial_balance', e.target.value)}
              className={`${styles.input} ${errors.initial_balance ? styles.inputError : ''}`}
            />
            <span className={styles.fieldHint}>Inicijalni depozit u valuti računa</span>
            {errors.initial_balance && <span className={styles.greska}>{errors.initial_balance}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Dnevni limit <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={form.daily_limit}
              onChange={e => onChange('daily_limit', e.target.value)}
              className={`${styles.input} ${errors.daily_limit ? styles.inputError : ''}`}
            />
            {errors.daily_limit && <span className={styles.greska}>{errors.daily_limit}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Mesečni limit <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={form.monthly_limit}
              onChange={e => onChange('monthly_limit', e.target.value)}
              className={`${styles.input} ${errors.monthly_limit ? styles.inputError : ''}`}
            />
            {errors.monthly_limit && <span className={styles.greska}>{errors.monthly_limit}</span>}
          </div>
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.create_card}
            onChange={e => onChange('create_card', e.target.checked)}
            className={styles.checkbox}
          />
          <div>
            <div className={styles.checkboxLabel}>Napravi karticu</div>
            <div className={styles.checkboxDesc}>
              Sistem automatski generiše zahtev i vezuje novu debitnu karticu za ovaj račun
            </div>
          </div>
        </label>
      </div>
    </>
  );
}
