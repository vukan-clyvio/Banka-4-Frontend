// src/features/exchange/ExchangeTable.jsx
import styles from './RatesList.module.css';  // ili CurrencyCalculator.module.css – ako koristiš isti css fajl

export default function ExchangeTable({ rates }) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.modernTable}>
                <thead>
                <tr>
                    <th>Valuta</th>
                    <th>Kupovni kurs</th>
                    <th>Srednji kurs</th>
                    <th>Prodajni kurs</th>

                </tr>
                </thead>
                <tbody>
                {rates.map(rate => (
                    <tr key={rate.code} className={styles.row}>
                        <td className={styles.currencyCell}>
                            <img
                                src={rate.flag}
                                alt={`${rate.code} zastava`}
                                className={styles.flag}
                                width={24}
                                height={18}
                                loading="lazy"
                                onError={e => {
                                    e.target.src = '/flags/fallback.svg';
                                    e.target.alt = 'Zastava nije dostupna';
                                }}
                            />
                            <span>{rate.code}</span>
                        </td>
                        <td>{rate.buy?.toFixed(2) || '—'}</td>
                        <td className={styles.midRate}>{rate.mid?.toFixed(4) || '—'}</td>
                        <td>{rate.sell?.toFixed(2) || '—'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}