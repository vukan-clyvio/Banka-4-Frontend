import CardStatusBadge from './CardStatusBadge';
import styles          from './CardsTable.module.css';

export default function CardsTable({ clients, onUnblockClick }) {
  if (clients.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--tx-3)" strokeWidth="1.5" width="32" height="32">
            <rect x="1" y="4" width="22" height="16" rx="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <p>Nema klijenata koji odgovaraju zadatim filterima.</p>
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
              <th>JMBG</th>
              <th>Broj kartice</th>
              <th>Broj računa</th>
              <th>Status</th>
              <th>Akcija</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => {
              const cards      = client.cards ?? [];
              const clientName = `${client.first_name} ${client.last_name}`;

              if (cards.length === 0) {
                return (
                  <tr key={`client-${client.id}`}>
                    <td>
                      <div className={styles.clientName}>{clientName}</div>
                      <div className={styles.clientMeta}>{client.email}</div>
                    </td>
                    <td className={styles.mono}>{client.jmbg}</td>
                    <td colSpan={4} className={styles.noCards}>Klijent nema kartice</td>
                  </tr>
                );
              }

              return cards.map((card, idx) => (
                <tr key={card.id}>
                  {idx === 0 && (
                    <td rowSpan={cards.length}>
                      <div className={styles.clientName}>{clientName}</div>
                      <div className={styles.clientMeta}>{client.email}</div>
                    </td>
                  )}
                  {idx === 0 && (
                    <td rowSpan={cards.length} className={styles.mono}>{client.jmbg}</td>
                  )}
                  <td className={styles.mono}>{card.card_number}</td>
                  <td className={styles.mono}>{card.account_number}</td>
                  <td>
                    <CardStatusBadge status={card.status} />
                  </td>
                  <td>
                    {card.status === 'BLOKIRANA' && (
                      <button
                        className={styles.btnUnblock}
                        onClick={() => onUnblockClick({ card, clientName })}
                      >
                        Deblokiraj
                      </button>
                    )}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
