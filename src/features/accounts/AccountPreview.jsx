import { ACCOUNT_CATEGORIES } from './AccountForm';
import styles from './AccountPreview.module.css';

export default function AccountPreview({
  existingClient,
  newClientData,
  clientMode,
  accountData,
}) {
  const ownerName =
    clientMode === 'existing' && existingClient
      ? `${existingClient.first_name} ${existingClient.last_name}`
      : clientMode === 'new'
        ? [newClientData.first_name, newClientData.last_name].filter(Boolean).join(' ') || null
        : null;

  const categoryLabel =
    ACCOUNT_CATEGORIES.find(c => c.value === accountData.category)?.label ?? null;

  const typeLabel =
    accountData.account_type === 'tekuci'  ? 'Tekući račun' :
    accountData.account_type === 'devizni' ? 'Devizni račun' : null;

  return (
    <aside className={styles.sidebar}>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Pregled novog računa</span>
        </div>

        <div className={styles.accountVisual}>
          <div className={styles.visualType}>
            {typeLabel && accountData.currency
              ? `${typeLabel} · ${accountData.currency}`
              : 'Tip računa nije izabran'}
          </div>
          <div className={styles.visualOwner}>
            {ownerName ?? <span className={styles.placeholder}>Klijent nije izabran</span>}
          </div>
          <div className={styles.visualNumber}>Broj će biti generisan</div>

          <div className={styles.visualBalances}>
            <div>
              <div className={styles.balLabel}>Stanje</div>
              <div className={styles.balValue}>
                {accountData.initial_balance
                  ? Number(accountData.initial_balance).toLocaleString('sr-RS', { minimumFractionDigits: 2 })
                  : '0,00'}
              </div>
            </div>
            <div>
              <div className={styles.balLabel}>Valuta</div>
              <div className={styles.balValue}>{accountData.currency || '—'}</div>
            </div>
          </div>
        </div>

        {categoryLabel && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Kategorija</span>
            <span className={styles.infoVal}>{categoryLabel}</span>
          </div>
        )}
        {accountData.daily_limit && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Dnevni limit</span>
            <span className={styles.infoVal}>
              {Number(accountData.daily_limit).toLocaleString('sr-RS', { minimumFractionDigits: 2 })}
              {accountData.currency ? ` ${accountData.currency}` : ''}
            </span>
          </div>
        )}
        {accountData.monthly_limit && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Mesečni limit</span>
            <span className={styles.infoVal}>
              {Number(accountData.monthly_limit).toLocaleString('sr-RS', { minimumFractionDigits: 2 })}
              {accountData.currency ? ` ${accountData.currency}` : ''}
            </span>
          </div>
        )}

        <div className={styles.checklist}>
          <div className={styles.checkItem}>
            <span className={styles.checkMark}>✓</span>
            IBAN broj će biti automatski dodeljen
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkMark}>✓</span>
            Klijent će dobiti obaveštenje e-mailom
          </div>
          <div className={styles.checkItem}>
            <span className={styles.checkMark}>✓</span>
            Račun aktivan odmah po kreiranju
          </div>
          {accountData.create_card && (
            <div className={styles.checkItem}>
              <span className={styles.checkMark}>✓</span>
              Debitna kartica će biti kreirana
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoCardHeader}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>Napomene</span>
        </div>
        <div className={styles.infoCardBody}>
          {[
            { bold: 'Tekući račun', rest: ' podržava isključivo RSD valutu' },
            { bold: 'Devizni račun', rest: ' podržava EUR, CHF, USD, GBP, JPY, CAD, AUD' },
            { bold: 'Kartica', rest: ' se vezuje automatski ako je opcija uključena' },
            { bold: 'Limiti', rest: ' se mogu izmeniti iz profila klijenta nakon kreiranja' },
          ].map((item, i) => (
            <div key={i} className={styles.infoItem}>
              <div className={styles.infoBullet} />
              <div className={styles.infoItemText}>
                <strong>{item.bold}</strong>{item.rest}
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}
