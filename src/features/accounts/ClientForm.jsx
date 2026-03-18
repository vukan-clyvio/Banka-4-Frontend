import styles from './ClientForm.module.css';

export default function ClientForm({
  clientMode,
  existingClient,
  onClear,
  newClientData,
  onClientChange,
  errors,
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span className={styles.sectionTitle}>Podaci o klijentu</span>
      </div>

      {clientMode === 'existing' && existingClient ? (
        <div className={styles.clientBar}>
          <div className={styles.clientAvatar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div className={styles.clientInfo}>
            <div className={styles.clientName}>
              {existingClient.first_name} {existingClient.last_name}
            </div>
            <div className={styles.clientMeta}>
              {existingClient.email}
              {existingClient.jmbg && (
                <> · <span className={styles.mono}>{existingClient.jmbg}</span></>
              )}
            </div>
          </div>
          <button type="button" onClick={onClear} className={styles.btnClear}>
            Promeni klijenta
          </button>
        </div>
      ) : (
        <>
          <p className={styles.hint}>
            Klijent nije pronađen u sistemu. Popunite podatke za kreiranje novog klijenta.
          </p>

          <div className={styles.fieldGrid}>
            <Polje label="Ime" required greska={errors.first_name}>
              <input
                type="text"
                value={newClientData.first_name}
                onChange={e => onClientChange('first_name', e.target.value)}
                className={`${styles.input} ${errors.first_name ? styles.inputError : ''}`}
              />
            </Polje>

            <Polje label="Prezime" required greska={errors.last_name}>
              <input
                type="text"
                value={newClientData.last_name}
                onChange={e => onClientChange('last_name', e.target.value)}
                className={`${styles.input} ${errors.last_name ? styles.inputError : ''}`}
              />
            </Polje>

            <Polje label="Email adresa" required greska={errors.email}>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={newClientData.email}
                onChange={e => onClientChange('email', e.target.value)}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
            </Polje>

            <Polje label="JMBG" required greska={errors.jmbg}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={13}
                value={newClientData.jmbg}
                onChange={e => onClientChange('jmbg', e.target.value)}
                className={`${styles.input} ${errors.jmbg ? styles.inputError : ''}`}
              />
            </Polje>
          </div>
        </>
      )}
    </div>
  );
}

function Polje({ label, required, greska, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      {children}
      {greska && <span className={styles.greska}>{greska}</span>}
    </div>
  );
}
