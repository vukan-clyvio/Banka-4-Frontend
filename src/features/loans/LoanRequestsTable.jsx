import LoanStatusBadge from './LoanStatusBadge';
import styles           from './LoanRequestsTable.module.css';

export default function LoanRequestsTable({ requests, onApprove, onReject, actionId }) {
  if (requests.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--tx-3)" strokeWidth="1.5" width="32" height="32">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <p>Nema aktivnih kreditnih zahteva.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Klijent</th>
              <th>Iznos</th>
              <th>Period</th>
              <th>Tip stope</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td className={styles.clientName}>{req.client_name}</td>
                <td className={styles.mono}>
                  {Number(req.amount).toLocaleString('sr-RS', { minimumFractionDigits: 2 })}{' '}
                  {req.currency}
                </td>
                <td>{req.duration_months} mes.</td>
                <td>
                  <span className={req.rate_type === 'VARIJABILNA' ? styles.badgeVar : styles.badgeFix}>
                    {req.rate_type === 'VARIJABILNA' ? 'Varijabilna' : 'Fiksna'}
                  </span>
                </td>
                <td>
                  <LoanStatusBadge status={req.status} />
                </td>
                <td>
                  {req.status === 'NA ČEKANJU' && (
                    <div className={styles.actionBtns}>
                      <button
                        className={styles.btnApprove}
                        onClick={() => onApprove(req.id)}
                        disabled={actionId === req.id}
                        title="Odobri kreditni zahtev"
                      >
                        {actionId === req.id ? '...' : 'Odobri'}
                      </button>
                      <button
                        className={styles.btnReject}
                        onClick={() => onReject(req.id)}
                        disabled={actionId === req.id}
                        title="Odbij kreditni zahtev"
                      >
                        {actionId === req.id ? '...' : 'Odbij'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
