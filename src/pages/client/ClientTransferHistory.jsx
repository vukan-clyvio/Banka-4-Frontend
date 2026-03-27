import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { transfersApi } from '../../api/endpoints/transfers';
import { useFetch } from '../../hooks/useFetch';
import Spinner from '../../components/ui/Spinner';
import styles from './ClientTransferHistory.module.css';

function formatAmount(amount, currency = 'RSD') {
  return (
    new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      .format(Math.abs(amount ?? 0)) + ' ' + currency
  );
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })
  );
}

const STATUS_MAP = {
  COMPLETED:   { label: 'Završen',    cls: 'badgeGreen' },
  SUCCESS:     { label: 'Završen',    cls: 'badgeGreen' },
  completed:   { label: 'Završen',    cls: 'badgeGreen' },
  PENDING:     { label: 'Na čekanju', cls: 'badgeAmber' },
  pending:     { label: 'Na čekanju', cls: 'badgeAmber' },
  IN_PROGRESS: { label: 'U obradi',   cls: 'badgeAmber' },
  processing:  { label: 'U obradi',   cls: 'badgeAmber' },
  REJECTED:    { label: 'Odbijen',    cls: 'badgeRed'   },
  FAILED:      { label: 'Neuspešan',  cls: 'badgeRed'   },
  failed:      { label: 'Neuspešan',  cls: 'badgeRed'   },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status ?? '—', cls: 'badgeGray' };
  return <span className={`${styles.badge} ${styles[s.cls]}`}>{s.label}</span>;
}

export default function ClientTransferHistory() {
  const navigate = useNavigate();
  const user     = useAuthStore(s => s.user);
  const logout   = useAuthStore(s => s.logout);
  const clientId = useAuthStore(s => s.user?.client_id ?? s.user?.id);

  const [page, setPage]                           = useState(1);
  const [showTransfersMenu, setShowTransfersMenu] = useState(false);
  const [showPaymentsMenu,  setShowPaymentsMenu]  = useState(false);
  const PAGE_SIZE = 20;

  // ── Ispravan endpoint: /clients/{clientId}/transfers ──
  const { data, loading, error } = useFetch(
    () => transfersApi.getHistory(clientId, { page, page_size: PAGE_SIZE }),
    [clientId, page]
  );

  const rawTransfers = data?.data ?? (Array.isArray(data) ? data : []);
  const totalPages   = data?.total_pages ?? 0;

  // Sortiraj od najnovijeg ka najstarijem
  const transfers = [...rawTransfers].sort((a, b) =>
    new Date(b.date ?? b.created_at ?? 0) - new Date(a.date ?? a.created_at ?? 0)
  );

  function handleLogout() { logout(); navigate('/login'); }

  const transfersSubItems = [
    { label: 'Novi transfer',      path: '/transfers/new' },
    { label: 'Istorija transfera', path: '/transfers/history' },
  ];
  const paymentsSubItems = [
    { label: 'Novo plaćanje',     path: '/client/payments/new' },
    { label: 'Prenos',            path: '/transfers/new' },
    { label: 'Primaoci plaćanja', path: '/client/recipients' },
    { label: 'Pregled plaćanja',  path: '/client/payments' },
  ];

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <button
          className={styles.headerBrand}
          onClick={() => navigate('/dashboard')}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className={styles.headerBrandText}>RAFBank</span>
        </button>

        <nav className={styles.headerNav}>
          <button className={styles.headerNavBtn} onClick={() => navigate('/client/accounts')}>Računi</button>

          <div className={styles.payDropdownWrap}>
            <button
              className={`${styles.headerNavBtn} ${styles.headerNavBtnActive}`}
              onClick={() => setShowTransfersMenu(p => !p)}
            >
              Transferi
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showTransfersMenu && (
              <div className={styles.payDropdownMenu}>
                {transfersSubItems.map(item => (
                  <button
                    key={item.label}
                    className={`${styles.payDropdownItem} ${item.path === '/transfers/history' ? styles.payDropdownItemActive : ''}`}
                    onClick={() => { navigate(item.path); setShowTransfersMenu(false); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className={styles.headerNavBtn} onClick={() => navigate('/client/exchange')}>Menjačnica</button>
          <button className={styles.headerNavBtn} onClick={() => navigate('/client/cards')}>Kartice</button>
          <button className={styles.headerNavBtn} onClick={() => navigate('/client/loans')}>Krediti</button>

          <div className={styles.payDropdownWrap}>
            <button
              className={`${styles.headerNavBtn} ${showPaymentsMenu ? styles.headerNavBtnActive : ''}`}
              onClick={() => setShowPaymentsMenu(p => !p)}
            >
              Plaćanja
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {showPaymentsMenu && (
              <div className={styles.payDropdownMenu}>
                {paymentsSubItems.map(item => (
                  <button
                    key={item.label}
                    className={styles.payDropdownItem}
                    onClick={() => { navigate(item.path); setShowPaymentsMenu(false); }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className={styles.headerRight}>
          <button className={styles.headerProfile}>
            <div className={styles.headerAvatar}>{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
            <span>{user?.first_name} {user?.last_name}</span>
          </button>
          <button className={styles.headerLogout} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Odjavi se
          </button>
        </div>
      </header>

      {/* SADRŽAJ */}
      <div className={styles.content}>
        <div className={styles.pageHead}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>← Nazad</button>
          <div>
            <h1 className={styles.pageTitle}>Istorija transfera</h1>
            <p className={styles.pageSub}>Svi vaši transferi, sortirani od najnovijeg ka najstarijem.</p>
          </div>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div className={styles.spinnerWrap}><Spinner /></div>
          ) : error ? (
            <div className={styles.empty}>Greška pri učitavanju transfera.</div>
          ) : transfers.length === 0 ? (
            <div className={styles.empty}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--tx-3)" strokeWidth="1.5">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              <p>Nema transfera za prikaz.</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Datum i vreme</th>
                      <th>Svrha</th>
                      <th>Sa računa</th>
                      <th>Na račun</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'right' }}>Iznos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((tx, i) => (
                      <tr key={tx.id ?? tx.transfer_id ?? i}>
                        <td className={styles.tdDate}>{formatDateTime(tx.date ?? tx.created_at)}</td>
                        <td><div className={styles.tdDesc}>{tx.purpose ?? tx.description ?? '—'}</div></td>
                        <td className={styles.tdAccount}>
                          {tx.from_account
                            ? `••••${String(tx.from_account).slice(-4)}`
                            : '—'}
                        </td>
                        <td className={styles.tdAccount}>
                          {tx.to_account
                            ? `••••${String(tx.to_account).slice(-4)}`
                            : '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}><StatusBadge status={tx.status} /></td>
                        <td className={styles.debit}>
                          -{formatAmount(tx.amount, tx.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prethodna</button>
                  <span className={styles.pageNum}>Strana {page} od {totalPages}</span>
                  <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sledeća →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
