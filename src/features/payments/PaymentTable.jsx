import styles from './PaymentTable.module.css';

export default function PaymentTable({ transactions, onRowClick }) {
  if (!transactions?.length) {
    return <div className={styles.empty}>Nema transakcija za prikaz.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Datum i vreme</th>
            <th>Primalac / Svrha</th>
            <th style={{ textAlign: 'right' }}>Iznos</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr 
              key={t.id} 
              className={styles.tableRow} 
              onClick={() => onRowClick(t)}
            >
              <td>{t.date}</td>
              <td>
                <div className={styles.name}>{t.recipient}</div>
                <div className={styles.type}>
                  {t.type === 'exchange' ? '🔄 Menjačnica' : '💸 Plaćanje'}
                </div>
              </td>
              
              {/* IZNOS - Ostaje standardan, bez bojenja */}
              <td style={{ textAlign: 'right' }} className={styles.amountNegative}>
                {t.amount.toLocaleString('sr-RS', { minimumFractionDigits: 2 })} {t.currency}
              </td>

              {/* STATUS - Ovde dodajemo 'badge' prefiks da bi se gađao tvoj CSS */}
              <td style={{ textAlign: 'center' }}>
                <span className={`${styles.badge} ${styles['badge' + t.status.replace(/\s+/g, '')]}`}>
                  {t.status}
                </span>
              </td>

              {/* STRELICA */}
              <td style={{ color: '#ccc', textAlign: 'right', paddingRight: '15px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}