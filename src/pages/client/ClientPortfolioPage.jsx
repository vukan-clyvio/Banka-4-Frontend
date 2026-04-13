import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useAuthStore } from '../../store/authStore';
import { portfolioApi } from '../../api/endpoints/portfolio';
import ClientHeader from '../../components/layout/ClientHeader';
import PortfolioTable from '../../features/portfolio/PortfolioTable';
import SellOrderModal from '../../features/portfolio/SellOrderModal';
import ProfitSummary from '../../features/portfolio/ProfitSummary';
import TaxSummary from '../../features/portfolio/TaxSummary';
import Spinner from '../../components/ui/Spinner';
import Alert from '../../components/ui/Alert';
import styles from './ClientPortfolioPage.module.css';

export default function ClientPortfolioPage() {
  const pageRef = useRef(null);

  const [portfolio, setPortfolio] = useState({ stocks: [], tax: { taxPaid: 0, taxUnpaid: 0 } });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [sellModal, setSellModal] = useState(null);

  const user = useAuthStore(s => s.user);
  const initFromStorage = useAuthStore(s => s.initFromStorage);

  useEffect(() => {
    if (!user) initFromStorage();
  }, [user, initFromStorage]);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const clientId = user.client_id ?? user.id;
        const res = await portfolioApi.getClientPortfolio(clientId);
        const rawData = res?.data || res;
        const allAssets = Array.isArray(rawData) ? rawData : (rawData?.assets ?? []);
        setPortfolio({
          stocks: allAssets.filter(a => a.type?.toUpperCase() === 'STOCK'),
          tax: rawData?.tax ?? { taxPaid: 0, taxUnpaid: 0 },
        });
      } catch (err) {
        console.error('Greška pri učitavanju portfolija:', err);
        setError('Nije moguće učitati podatke portfolija.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user?.id]);

  useLayoutEffect(() => {
    if (!loading && portfolio) {
      const ctx = gsap.context(() => {
        gsap.from('.page-anim', { opacity: 0, y: 20, duration: 0.4, stagger: 0.1, ease: 'power2.out' });
      }, pageRef);
      return () => ctx.revert();
    }
  }, [loading, portfolio]);

  const clientId = user?.client_id ?? user?.id;

  if (!user) return null;

  return (
    <div ref={pageRef} className={styles.stranica}>
      <ClientHeader activeNav="portfolio" />

      {sellModal && (
        <SellOrderModal
          asset={sellModal}
          clientId={clientId}
          onClose={() => setSellModal(null)}
          onSuccess={() => setSellModal(null)}
        />
      )}

      <main className={styles.sadrzaj}>
        <div className="page-anim">
          <div className={styles.breadcrumb}><span>Moj nalog</span></div>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Moj Portfolio</h1>
              <p className={styles.pageDesc}>Pregled vaših akcija i poresko stanje u realnom vremenu.</p>
            </div>
            {!loading && !error && <TaxSummary stats={portfolio.tax} />}
          </div>
        </div>

        {loading ? (
          <div className={styles.center}><Spinner /></div>
        ) : error ? (
          <div className={styles.center}><Alert tip="greska" poruka={error} /></div>
        ) : (
          <>
            <div className="page-anim">
              <ProfitSummary assets={portfolio.stocks} />
            </div>

            <div className={`page-anim ${styles.tableCard}`}>
              <div className={styles.cardHeader}>
                <h3>Moje akcije (Stocks)</h3>
              </div>
              <PortfolioTable
                assets={portfolio.stocks}
                isAdmin={false}
                onSell={asset => setSellModal(asset)}
              />
            </div>

            <div className="page-anim" style={{ marginTop: '32px', paddingBottom: '40px' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                  Za prodaju određenih akcija kliknite na dugme <strong>SELL</strong>.
                  Sredstva će biti prebačena na vaš račun tek nakon odobrenja.
                </p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
