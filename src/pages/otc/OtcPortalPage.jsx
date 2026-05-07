import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../../components/layout/Navbar';
import Spinner from '../../components/ui/Spinner';
import { useAuthStore } from '../../store/authStore';
import { portfolioApi } from '../../api/endpoints/portfolio';
import { accountsApi } from '../../api/endpoints/accounts';
import { otcApi } from '../../api/endpoints/otc';
import styles from './OtcPortalPage.module.css';


const TAB = {
  AKTIVNE: 'AKTIVNE',
  SKLOPLJENI: 'SKLOPLJENI',
};

function isExpired(settlementDate) {
  if (!settlementDate) return false;
  return new Date(settlementDate) < new Date();
}

// ─── Confirm Modal ───────────────────────────────────────────────────────────
function ConfirmModal({ contract, accounts, selectedAccount, onAccountChange, onConfirm, onClose, loading, error }) {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Iskoristi opciju</h3>
            <p className={styles.modalText}>Ticker: <strong>{contract.ticker}</strong></p>
          </div>
          <button className={styles.closeIconButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Količina:</span>
              <strong>{contract.amount}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Profit:</span>
              <strong className={contract.profit >= 0 ? styles.pos : styles.neg}>
                {contract.profit >= 0 ? '+' : ''}
                {Number(contract.profit ?? 0).toLocaleString('sr-RS', { minimumFractionDigits: 2 })} RSD
              </strong>
            </div>
          </div>

          {contract.profit < 0 && (
            <div className={styles.infoStrip}>
              ⚠️ Trenutni profit je negativan. Svejedno možete iskoristiti opciju.
            </div>
          )}

          <div className={styles.field}>
            <label>Račun za plaćanje <span className={styles.required}>*</span></label>
            <select value={selectedAccount} onChange={e => onAccountChange(e.target.value)}>
              <option value="">Izaberite račun...</option>
              {accounts.map((a, i) => {
                const num = a.AccountNumber ?? a.account_number ?? a.accountNumber ?? a.number ?? '';
                const name = a.Name ?? a.name ?? `Račun ${i + 1}`;
                const bal = a.Balance ?? a.balance ?? a.AvailableBalance ?? a.available_balance;
                const cur = a.Currency?.Code ?? a.currency ?? '';
                return (
                  <option key={num || i} value={num}>
                    {name}{num ? ` — ${num}` : ''}
                    {bal != null ? ` (${Number(bal).toLocaleString('sr-RS', { minimumFractionDigits: 2 })}${cur ? ` ${cur}` : ''})` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        <div className={styles.formActions}>
          <button className={styles.btnGhost} onClick={onClose} disabled={loading}>Otkaži</button>
          <button className={styles.btnPrimary} onClick={onConfirm} disabled={loading || !selectedAccount}>
            {loading ? 'Slanje...' : 'Potvrdi'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Sklopljeni ugovori ─────────────────────────────────────────────────
function SklopljeniUgovori() {
  const user = useAuthStore(s => s.user);
  const [options, setOptions]                 = useState([]);
  const [accounts, setAccounts]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [filter, setFilter]                   = useState('valid');
  const [confirmModal, setConfirmModal]       = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [exerciseError, setExerciseError]     = useState('');
  const [successMsg, setSuccessMsg]           = useState('');

  useEffect(() => {
  async function load() {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');

      const isEmployee = user?.identity_type === 'employee';
      const clientId = user?.client_id ?? user?.id;

      const res = await otcApi.getContracts();
      console.log(res);
      const contracts = Array.isArray(res) ? res : res?.data ?? [];
      
      setOptions(contracts);

      if (isEmployee) {
        const accountsRes = await accountsApi.getBankAccounts().catch(() => []);
        const accs = Array.isArray(accountsRes) ? accountsRes : (accountsRes?.data ?? []);
        setAccounts(accs);
      }

    } catch (err) {
      setError('Nije moguće učitati podatke. Pokušajte ponovo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  load();
}, [user?.id]);

  const filtered = options.filter(o => {
  // ❗ SKLONI već iskorišćene ugovore
  if (o.is_exercised) return false;

  // filtriraj po statusu
  return filter === 'expired'
    ? isExpired(o.settlement_date)
    : !isExpired(o.settlement_date);
});

  function openModal(contract) {
    setConfirmModal(contract);
    setSelectedAccount('');
    setExerciseError('');
  }

  async function handleExercise() {
    if (!confirmModal || !selectedAccount) return;
    try {
      setExerciseLoading(true);
      setExerciseError('');
      await portfolioApi.exerciseOption(user.id, confirmModal.stock_asset_id, selectedAccount)
      setSuccessMsg(`Opcija ${confirmModal.ticker} je uspešno iskorišćena!`);
      setConfirmModal(null);
      const res = await otcApi.getContracts();
      const contracts = Array.isArray(res) ? res : (res?.data ?? []);
      setOptions(contracts);
    } catch (err) {
      setExerciseError(err?.message ?? 'Greška pri iskorišćavanju opcije. Proverite da li je opcija in-the-money.');
    } finally {
      setExerciseLoading(false);
    }
  }

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.sectionEyebrow}>OTC Ponude i Ugovori</div>
          <h2 className={styles.sectionTitle}>Sklopljeni ugovori</h2>
        </div>
      </div>

      {successMsg && (
        <div className={styles.successBanner}>
          ✓ {successMsg}
          <button className={styles.dismissBtn} onClick={() => setSuccessMsg('')}>✕</button>
        </div>
      )}

      <div className={styles.filterRow}>
        <button
          className={`${styles.filterChip} ${filter === 'valid' ? styles.filterChipActive : ''}`}
          onClick={() => setFilter('valid')}
        >
          Važeći ugovori
        </button>
        <button
          className={`${styles.filterChip} ${filter === 'expired' ? styles.filterChipActive : ''}`}
          onClick={() => setFilter('expired')}
        >
          Istekli ugovori
        </button>
      </div>

      {loading ? (
        <div className={styles.loadingState}><Spinner /></div>
      ) : error ? (
        <div className={styles.errorBox}>{error}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyTable}>
          Nema {filter === 'expired' ? 'isteklih' : 'važećih'} ugovora.
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STOCK</th>
                <th>AMOUNT</th>
                <th>STRIKE PRICE</th>
                <th>PREMIUM</th>
                <th>SETTLEMENT DATE</th>
                <th>SELLER INFO</th>
                <th>PROFIT</th>
                {filter === 'valid' && <th>AKCIJA</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(contract => (
                <tr key={contract.otc_option_contract_id}className={isExpired(contract.settlement_date) ? styles.expiredRow : ''}>
                  <td className={styles.ticker}>{contract.ticker}</td>
                  <td>{contract.amount}</td>
                  <td>{contract.strike_price}</td>
                  <td>{contract.premium}</td>
                  <td>
                    {contract.settlement_date
                      ? new Date(contract.settlement_date).toLocaleDateString('sr-RS')
                      : '—'}
                  </td>
                  <td>Seller #{contract.seller_id}</td> {/* seller info */}
                  <td className={contract.profit >= 0 ? styles.pos : styles.neg}>
                    {contract.profit >= 0 ? '+' : ''}
                    {Number(contract.profit ?? 0).toLocaleString('sr-RS', { minimumFractionDigits: 2 })} RSD
                  </td>
                  {filter === 'valid' && (
                    <td>
                      <button className={styles.btnPrimary} onClick={() => openModal(contract)}>
                        Iskoristi
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          contract={confirmModal}
          accounts={accounts}
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
          onConfirm={handleExercise}
          onClose={() => setConfirmModal(null)}
          loading={exerciseLoading}
          error={exerciseError}
        />
      )}
    </section>
  );
}

// ─── Tab: Aktivne ponude (placeholder za Dušana) ─────────────────────────────
function AktivnePonude() {
  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.sectionEyebrow}>OTC Ponude i Ugovori</div>
          <h2 className={styles.sectionTitle}>Aktivne ponude</h2>
        </div>
      </div>
      <div className={styles.emptyTable}>Aktivne ponude su u izradi.</div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function OtcPortalPage() {
  const pageRef = useRef(null);
  const [activeTab, setActiveTab] = useState(TAB.SKLOPLJENI);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = pageRef.current?.querySelectorAll('.page-anim');
      if (!nodes?.length) return;
      gsap.from(nodes, { opacity: 0, y: 20, duration: 0.45, stagger: 0.08, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [activeTab]);

  return (
    <div ref={pageRef} className={styles.stranica}>
      <Navbar />

      <main className={styles.sadrzaj}>
        <div className="page-anim">
          <div className={styles.breadcrumb}>
            <span>OTC</span>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbAktivna}>
              {activeTab === TAB.AKTIVNE ? 'Aktivne ponude' : 'Sklopljeni ugovori'}
            </span>
          </div>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>OTC Ponude i Ugovori</h1>
              <p className={styles.pageDesc}>Pregled aktivnih pregovora i zaključenih opcionih ugovora.</p>
            </div>
          </div>
        </div>

        <section className={`page-anim ${styles.tabsCard}`}>
          <div className={styles.tabsRow}>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === TAB.AKTIVNE ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(TAB.AKTIVNE)}
            >
              Aktivne ponude
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${activeTab === TAB.SKLOPLJENI ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab(TAB.SKLOPLJENI)}
            >
              Sklopljeni ugovori
            </button>
          </div>
        </section>

        <div className="page-anim">
          {activeTab === TAB.AKTIVNE ? <AktivnePonude /> : <SklopljeniUgovori />}
        </div>
      </main>
    </div>
  );
}
