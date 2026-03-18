import styles from './LoanDetails.module.css';

export default function LoanDetails({ loan }) {
  if (!loan) return null;

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2 }).format(amount);

  return (
    <div className={styles.detailsContainer}>
      <header className={styles.header}>
        <h2>{loan.name}</h2>
        <span className={styles.loanId}>Partija: {loan.id}</span>
      </header>

      {/* Finansijski podaci (Req 2) */}
      <div className={styles.financialGrid}>
        <div className={styles.card}>
          <span>Nominalna kamata (NKS)</span>
          <strong>{loan.nks}%</strong>
        </div>
        <div className={styles.card}>
          <span>Efektivna kamata (EKS)</span>
          <strong>{loan.eks}%</strong>
        </div>
        <div className={styles.card}>
          <span>Preostalo dugovanje</span>
          <strong className={styles.debt}>{formatCurrency(loan.remaining_debt)} {loan.currency}</strong>
        </div>
      </div>

      {/* Nadolazeća obaveza - ISTAKNUTO (Req 2) */}
      <section className={styles.nextInstallment}>
        <h3>Sledeća rata</h3>
        <div className={styles.nextDueBox}>
          <div>
            <p>Datum dospijeća</p>
            <strong>{loan.next_due_date}</strong>
          </div>
          <div>
            <p>Iznos rate</p>
            <strong>{formatCurrency(loan.next_installment)} {loan.currency}</strong>
          </div>
        </div>
      </section>

      {/* Anuitetni plan (Req 2) */}
      <section className={styles.plan}>
        <h3>Istorija plaćenih rata (Anuitetni plan)</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Rata</th>
              <th>Glavnica</th>
              <th>Kamata</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loan.installments.map((inst) => (
              <tr key={inst.id}>
                <td>{inst.date}</td>
                <td>{formatCurrency(inst.amount)}</td>
                <td>{formatCurrency(inst.principal)}</td>
                <td>{formatCurrency(inst.interest)}</td>
                <td><span className={styles.paidBadge}>{inst.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}