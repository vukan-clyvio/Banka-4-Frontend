import { useState, useEffect } from 'react';
import { authApi }             from '../../api/endpoints/auth';
import { validirajLozinku, sePoklapa, jacinalozinke } from '../../utils/helpers';
import Alert                   from '../ui/Alert';
import styles                  from './ChangePasswordModal.module.css';

export default function ChangePasswordModal({ open, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [error,       setError]       = useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);

  useEffect(() => {
    if (!open) {
      setOldPassword('');
      setNewPassword('');
      setConfirm('');
      setError(null);
      setSubmitting(false);
      setSuccess(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!oldPassword.trim()) { setError('Unesite trenutnu lozinku.'); return; }
    const pwError = validirajLozinku(newPassword);
    if (pwError) { setError(pwError); return; }
    const matchError = sePoklapa(newPassword, confirm, 'Lozinke se ne poklapaju');
    if (matchError) { setError(matchError); return; }

    setSubmitting(true);
    setError(null);
    try {
      await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.error ?? 'Greška pri promeni lozinke.');
    } finally {
      setSubmitting(false);
    }
  }

  const strength = newPassword ? jacinalozinke(newPassword) : null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {success ? (
          <div className={styles.successCenter}>
            <div className={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className={styles.title}>Lozinka je promenjena</h3>
            <p className={styles.subtitle}>Vaša nova lozinka je uspešno sačuvana.</p>
            <button className={styles.btnPrimary} onClick={onClose} style={{ width: '100%', marginTop: 8 }}>
              Zatvori
            </button>
          </div>
        ) : (
          <>
            <h3 className={styles.title}>Promena lozinke</h3>
            <p className={styles.subtitle}>Unesite trenutnu i novu lozinku.</p>
            <div className={styles.divider} />

            {error && <Alert tip="greska" poruka={error} />}

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label>
                  Trenutna lozinka <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => { setOldPassword(e.target.value); setError(null); }}
                  className={oldPassword ? styles.hasValue : ''}
                  autoComplete="current-password"
                />
              </div>

              <div className={styles.field}>
                <label>
                  Nova lozinka <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setError(null); }}
                  className={newPassword ? styles.hasValue : ''}
                  autoComplete="new-password"
                />
                {strength && (
                  <div className={styles.pwStrength}>
                    <div className={styles.pwStrengthBar}>
                      <div
                        className={styles.pwStrengthFill}
                        style={{ width: strength.procenat, background: strength.boja }}
                      />
                    </div>
                    <span className={styles.pwStrengthLabel} style={{ color: strength.boja }}>
                      {strength.naziv} lozinka
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label>
                  Potvrdi novu lozinku <span className={styles.required}>*</span>
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(null); }}
                  className={confirm ? styles.hasValue : ''}
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.actions}>
                <button type="button" className={styles.btnGhost} onClick={onClose}>
                  Otkaži
                </button>
                <button type="submit" disabled={submitting} className={styles.btnPrimary}>
                  {submitting ? 'Čuvanje...' : 'Promeni lozinku'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
