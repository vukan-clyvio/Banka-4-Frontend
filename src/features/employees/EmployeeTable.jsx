import styles from './EmployeeTable.module.css';

export default function EmployeeTable({ employees, onRowClick }) {
  if (!employees?.length) {
    return <div className={styles.empty}>Nema zaposlenih za prikaz.</div>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ime</th>
            <th>Prezime</th>
            <th>Email</th>
            <th>ID Pozicije</th>
            <th>Departman</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} onClick={() => onRowClick(emp.employee_id)}>
              <td className={styles.name}>{emp.first_name}</td>
              <td className={styles.name}>{emp.last_name}</td>
              <td className={styles.email}>{emp.email}</td>
              <td>{emp.position_id}</td>
              <td>{emp.department}</td>
              <td>
                <span className={`${styles.badge} ${emp.active ? styles.badgeActive : styles.badgeInactive}`}>
                  {emp.active ? 'Aktivan' : 'Neaktivan'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
