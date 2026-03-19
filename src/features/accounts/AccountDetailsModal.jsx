import { useState } from 'react';
import { accountsApi } from '../../api/endpoints/accounts';
import { useAuthStore } from '../../store/authStore';
import styles from './AccountDetailsModal.module.css';

export default function AccountDetailsModal({ open, onClose, account, onAccountUpdated }) {
  const clientId = useAuthStore(s => s.user?.id);
  const [view, setView] = useState('details'); // details | rename | limits
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rename form state
  const [newName, setNewName] = useState('');

  // Limits form state
  const [dailyLimit, setDailyLimit] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');

  if (!open || !account) return null;

  const isBusiness = account.account_type === 'BUSINESS';

  const fmt = (val) =>
    new Intl.NumberFormat('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const statusLabel = {
    ACTIVE:  'Aktivan',
    BLOCKED: 'Blokiran',
    CLOSED:  'Zatvoren',
  };

  function handleClose() {
    setView('details');
    setError('');
    setLoading(false);
    onClose();
  }

  function openRename() {
    setNewName(account.name || '');
    setError('');
    setView('rename');
  }

  function openLimits() {
    setDailyLimit(account.daily_limit?.toString() || '');
    setMonthlyLimit(account.monthly_limit?.toString() || '');
    setError('');
    setView('limits');
  }

  async function submitRename(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const accountNumber = account.account_number ?? account.number;
      await accountsApi.updateName(clientId, accountNumber, newName.trim());
      onAccountUpdated?.();
      setView('details');
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri promeni naziva');
    } finally {
      setLoading(false);
    }
  }

  async function submitLimits(e) {
    e.preventDefault();
    if (!dailyLimit || !monthlyLimit) return;
    setLoading(true);
    setError('');
    try {
      const accountNumber = account.account_number ?? account.number;
      // Step 1: request limit change — backend sends OTP to client
      await accountsApi.requestLimitChange(clientId, accountNumber, {
        daily_limit:   parseFloat(dailyLimit),
        monthly_limit: parseFloat(monthlyLimit),
      });
      onAccountUpdated?.();
      setView('details');
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri promeni limita');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.title}>
            {view === 'details' && 'Detalji računa'}
            {view === 'rename' && 'Promeni naziv'}
            {view === 'limits' && 'Promeni limite'}
          </h3>
          <button className={styles.closeBtn} onClick={handleClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <div className={styles.modalBody}>
          {/* ─── Details view ─── */}
          {view === 'details' && (
            <>
              {isBusiness && (
                <>
                  <div className={styles.sectionLabel}>Podaci o firmi</div>
                  <div className={styles.grid}>
                    <div className={styles.field}><span className={styles.fieldLabel}>Naziv firme</span><span className={styles.fieldValue}>{account.company_name}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>PIB</span><span className={styles.fieldValueMono}>{account.pib}</span></div>
                    <div className={styles.field}><span className={styles.fieldLabel}>Matični broj (MB)</span><span className={styles.fieldValueMono}>{account.mb}</span></div>
                  </div>
                  <div className={styles.divider} />
                </>
              )}

              <div className={styles.sectionLabel}>Informacije o računu</div>
              <div className={styles.grid}>
                <div className={styles.field}><span className={styles.fieldLabel}>Naziv</span><span className={styles.fieldValue}>{account.name}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Broj računa</span><span className={styles.fieldValueMono}>{account.account_number}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Vlasnik</span><span className={styles.fieldValue}>{account.owner_name}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Status</span><span className={`${styles.badge} ${styles['badge_' + account.status]}`}>{statusLabel[account.status] ?? account.status}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Valuta</span><span className={styles.fieldValue}>{account.currency}</span></div>
              </div>

              <div className={styles.divider} />

              <div className={styles.sectionLabel}>Stanje</div>
              <div className={styles.grid}>
                <div className={styles.field}><span className={styles.fieldLabel}>Ukupno stanje</span><span className={styles.fieldValue}>{fmt(account.balance)} {account.currency}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Raspoloživo</span><span className={styles.fieldValue}>{fmt(account.available_balance)} {account.currency}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Rezervisano</span><span className={styles.fieldValue}>{fmt(account.reserved_funds)} {account.currency}</span></div>
              </div>

              <div className={styles.divider} />

              <div className={styles.sectionLabel}>Limiti</div>
              <div className={styles.grid}>
                <div className={styles.field}><span className={styles.fieldLabel}>Dnevni limit</span><span className={styles.fieldValue}>{fmt(account.daily_limit)} {account.currency}</span></div>
                <div className={styles.field}><span className={styles.fieldLabel}>Mesečni limit</span><span className={styles.fieldValue}>{fmt(account.monthly_limit)} {account.currency}</span></div>
              </div>
            </>
          )}

          {/* ─── Rename form ─── */}
          {view === 'rename' && (
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Novi naziv računa</label>
                <input className={styles.formInput} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Unesite novi naziv" required />
              </div>
            </div>
          )}

          {/* ─── Limits form ─── */}
          {view === 'limits' && (
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Dnevni limit ({account.currency})</label>
                <input className={styles.formInput} type="number" step="0.01" min="0" value={dailyLimit} onChange={e => setDailyLimit(e.target.value)} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mesečni limit ({account.currency})</label>
                <input className={styles.formInput} type="number" step="0.01" min="0" value={monthlyLimit} onChange={e => setMonthlyLimit(e.target.value)} required />
              </div>
            </div>
          )}
        </div>

        {/* ─── Sticky action buttons ─── */}
        {view === 'details' && (
          <div className={styles.actions}>
            <div className={styles.actionsRow}>
              <button className={styles.btnOutline} onClick={openRename}>Promeni naziv</button>
              <button className={styles.btnOutline} onClick={openLimits}>Promeni limite</button>
              <button className={styles.btnGhost} onClick={handleClose}>Zatvori</button>
            </div>
          </div>
        )}
        {view === 'rename' && (
          <div className={styles.actions}>
            <button className={styles.btnPrimary} style={{width:'100%',justifyContent:'center'}} disabled={loading} onClick={submitRename}>{loading ? 'Čuvanje...' : 'Sačuvaj'}</button>
            <div className={styles.actionsRow}><button className={styles.btnGhost} onClick={() => setView('details')}>Nazad</button></div>
          </div>
        )}
        {view === 'limits' && (
          <div className={styles.actions}>
            <button className={styles.btnPrimary} style={{width:'100%',justifyContent:'center'}} disabled={loading} onClick={submitLimits}>{loading ? 'Čuvanje...' : 'Sačuvaj'}</button>
            <div className={styles.actionsRow}><button className={styles.btnGhost} onClick={() => setView('details')}>Nazad</button></div>
          </div>
        )}
      </div>
    </div>
  );
}
