import styles from './TaxSummary.module.css';

export default function TaxSummary({ totalTax }) {
  if (totalTax == null) return null;

  return (
    <div className={styles.taxWrapper}>
      <div className={styles.taxItem}>
        <span className={styles.label}>Akumuliran porez</span>
        <span className={styles.paid}>{totalTax.toLocaleString('sr-RS', { minimumFractionDigits: 2 })} RSD</span>
      </div>
    </div>
  );
}