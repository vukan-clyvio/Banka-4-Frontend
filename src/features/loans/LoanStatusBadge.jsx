import styles from './LoanStatusBadge.module.css';

const STATUS_MAP = {
  'NA ČEKANJU': { mod: 'amber', label: 'Na čekanju' },
  'ODOBRENO':   { mod: 'green', label: 'Odobreno'   },
  'ODBIJENO':   { mod: 'red',   label: 'Odbijeno'   },
};

export default function LoanStatusBadge({ status }) {
  const { mod, label } = STATUS_MAP[status] ?? { mod: 'gray', label: status };
  return (
    <span className={`${styles.badge} ${styles[mod]}`}>
      {label}
    </span>
  );
}
