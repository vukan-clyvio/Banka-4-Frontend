import { useNavigate } from 'react-router-dom';
import styles from './PortfolioTable.module.css';

export default function PortfolioTable({ assets, isAdmin, onSell }) {
  const navigate = useNavigate();

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>TICKER</th>
            <th>AMOUNT</th>
            <th>PRICE</th>
            <th>PROFIT</th>
            <th>LAST MODIFIED</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td className={styles.ticker}>{asset.ticker}</td>
              <td>{asset.amount}</td>
              <td>${asset.price}</td>
              <td className={asset.profit >= 0 ? styles.pos : styles.neg}>
                {asset.profit >= 0 ? '+' : ''}${asset.profit}
              </td>
              <td style={{ color: '#64748b', fontSize: '12px' }}>
                {asset.lastModified || '21-03-2026'}
              </td>
              <td>
                <div className={styles.actionCell}>
                  {/* SELL dugme za sve */}
                  <button
                    className={styles.sellBtn}
                    onClick={() => onSell?.(asset)}
                  >
                    SELL
                  </button>

                  {/* OTC kontrole samo za Admina */}
                  {isAdmin && (
                    <div className={styles.otcWrapper}>
                      <div className={styles.divider} />
                      <input type="number" placeholder="Qty" className={styles.miniInput} />
                      <button className={styles.publicBtn}>Public</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}