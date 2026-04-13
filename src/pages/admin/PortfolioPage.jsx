import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { useAuthStore } from '../../store/authStore';
import { usePermissions } from '../../hooks/usePermissions'; 
import Navbar from '../../components/layout/Navbar';
import PortfolioTable from '../../features/portfolio/PortfolioTable';
import ProfitSummary from '../../features/portfolio/ProfitSummary';
import TaxSummary from '../../features/portfolio/TaxSummary';
import OptionsSection from '../../features/portfolio/OptionsSection';
import { portfolioApi } from '../../api/endpoints/portfolio';
import SellOrderModal from '../../features/portfolio/SellOrderModal';
import styles from './PortfolioPage.module.css';

const FAKE_PORTFOLIO_ASSETS = [
    { id: 1, type: 'Stock', ticker: 'AAPL', amount: 100, price: 150, profit: 500, lastModified: '2026-03-21', status: 'Active' },
    { id: 2, type: 'Option', ticker: 'MSFT', optionType: 'CALL', strike: 280, current: 300, settlement: '2026-04-25', status: 'ITM' },
    { id: 3, type: 'Option', ticker: 'TSLA', optionType: 'PUT', strike: 700, current: 680, settlement: '2026-03-20', status: 'OTM' }
];

const FAKE_PORTFOLIO_STATS = { taxPaid: 1200, taxUnpaid: 450 };

export default function PortfolioPage() {
  const pageRef = useRef(null);
  const { can } = usePermissions();
  const user = useAuthStore(s => s.user);
  const initFromStorage = useAuthStore(s => s.initFromStorage);

  // --- ISPRAVLJEN STATE (Počinjemo sa praznim podacima) ---
  const [data, setData] = useState({
    stocks: [],
    options: [],
    tax: { taxPaid: 0, taxUnpaid: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [sellModal, setSellModal] = useState(null);

  useEffect(() => {
    if (!user) initFromStorage();
  }, [user, initFromStorage]);

  const canManageOTC = can('portfolio.otc.manage') || can('admin.all');
  const canExercise = can('portfolio.options.exercise');
  const canViewOptions = can('portfolio.options.view') || canExercise;

  // --- ISPRAVLJENA API LOGIKA ---
  // --- ISPRAVLJENA API LOGIKA ---
  useEffect(() => {
    const loadEverything = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        let res;
        
        // Dinamički biramo endpoint: Actuary/Admin ili običan Client
        if (canManageOTC || canViewOptions) {
          res = await portfolioApi.getActuaryPortfolio(user.id);
        } else {
          // OVO JE DODATO: Poziv za običnog klijenta ako uslovi iznad nisu ispunjeni
          res = await portfolioApi.getClientPortfolio(user.id);
        }

        // Tvoj client.js verovatno već vraća res.data kroz interceptor, 
        // ali za svaki slučaj radimo proveru formata:
        const rawData = res?.data || res; 
        const allAssets = Array.isArray(rawData) ? rawData : (rawData?.assets || []);
        
        setData({
          stocks: allAssets.filter(a => a.type?.toUpperCase() === 'STOCK'),
          options: allAssets.filter(a => a.type?.toUpperCase() === 'OPTION'),
          tax: rawData?.tax || { taxPaid: 0, taxUnpaid: 0 }
        });

      } catch (err) {
        console.error("API Error na portu 8082:", err);
        // Resetujemo state na prazno u slučaju greške da UI ne bi "pukao"
        setData({ stocks: [], options: [], tax: { taxPaid: 0, taxUnpaid: 0 } });
      } finally {
        setLoading(false);
      }
    };

    loadEverything();
  }, [user?.id, canManageOTC, canViewOptions]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.page-anim', { opacity: 0, y: 20, duration: 0.4, stagger: 0.08, ease: 'power2.out' });
    }, pageRef);
    return () => ctx.revert();
  }, [data]); // Okidaj animaciju kada se podaci promene

  if (!user) return null;

  const clientId = user?.client_id ?? user?.id;

  return (
    <div ref={pageRef} className={styles.stranica}>
      <Navbar />

      {sellModal && (
        <SellOrderModal
          asset={sellModal}
          clientId={clientId}
          isEmployee
          onClose={() => setSellModal(null)}
          onSuccess={() => setSellModal(null)}
        />
      )}
      <main className={styles.sadrzaj}>
        
        <div className="page-anim">
          <div className={styles.breadcrumb}><span>Portfolio</span></div>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Moj Portfolio</h1>
              <p className={styles.pageDesc}>Pregled akcija i finansijskih instrumenata.</p>
            </div>
            {/* Koristi data.tax */}
            <TaxSummary stats={data.tax} />
          </div>
        </div>

        <div className="page-anim">
          {/* Koristi data.stocks */}
          <ProfitSummary assets={data.stocks} />
        </div>

        {/* TABELA 1: Akcije */}
        <div className={`page-anim ${styles.tableCard}`}>
          <div className={styles.cardHeader}><h3>Hartije od vrednosti</h3></div>
          <PortfolioTable assets={data.stocks} isAdmin={canManageOTC} onSell={asset => setSellModal(asset)} />
        </div>

        {/* TABELA 2: Opcije */}
        {canViewOptions && (
          <div className={`page-anim ${styles.tableCard}`} style={{ marginTop: '32px' }}>
            <div className={styles.cardHeader}><h3>Opcije i Derivati</h3></div>
            <OptionsSection assets={data.options} canExercise={canExercise} />
          </div>
        )}

        {/* TABELA 3: OTC Panel */}
        {canManageOTC && (
          <div className={`page-anim ${styles.tableCard}`} style={{ marginTop: '32px' }}>
            <div className={styles.cardHeader}>
               <div className={styles.headerWithBadge}>
                  <h3>Upravljanje javnim akcijama (OTC)</h3>
                  <span className={styles.adminBadge}>ADMIN CONTROL</span>
               </div>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>TICKER</th>
                    <th>JAVNA KOLIČINA</th>
                    <th>CENA</th>
                    <th style={{ textAlign: 'right' }}>AKCIJE</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Koristi data.stocks */}
                  {data.stocks.map(asset => (
                    <tr key={asset.id}>
                      <td className={styles.ticker}>{asset.ticker}</td>
                      <td>{asset.amount}</td>
                      <td>${asset.price}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button className={styles.removeBtn}>Povuci sa portala</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}