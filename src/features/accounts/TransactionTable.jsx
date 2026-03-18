import Spinner from '../../components/ui/Spinner';
import styles  from './TransactionTable.module.css';

const SORT_OPTIONS = [
  { by: 'date', order: 'desc', label: 'Datum ↓' },
  { by: 'date', order: 'asc',  label: 'Datum ↑' },
  { by: 'type', order: 'asc',  label: 'Tip A-Z' },
  { by: 'type', order: 'desc', label: 'Tip Z-A' },
];

export default function TransactionTable({ transactions, loading, sortBy, sortOrder, onSort }) {
  if (loading) return <Spinner />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Transakcije</h2>
        <div className={styles.sortGroup}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.by + opt.order}
              className={`${styles.sortBtn} ${sortBy === opt.by && sortOrder === opt.order ? styles.sortActive : ''}`}
              onClick={() => onSort(opt.by, opt.order)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className={styles.empty}>Nema evidentiranih transakcija za izabrani period.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Primalac / Platilac</th>
              <th>Šifra plaćanja</th>
              <th className={styles.alignRight}>Iznos</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => {
              const isDeposit = txn.type === 'DEPOSIT';
              const formatted = new Intl.NumberFormat('sr-RS', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(txn.amount);

              return (
                <tr key={txn.transaction_id}>
                  <td className={styles.date}>
                    {new Date(txn.date).toLocaleDateString('sr-RS', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </td>
                  <td>{txn.recipient_payer}</td>
                  <td className={styles.code}>{txn.payment_code}</td>
                  <td className={`${styles.amount} ${isDeposit ? styles.deposit : styles.withdrawal}`}>
                    {isDeposit ? '+' : '-'}{formatted} {txn.currency}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
