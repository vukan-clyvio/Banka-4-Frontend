import { useEffect, useMemo, useState } from "react";
import styles from "./CreateAccount.module.css";

const DEVIZNE_VALUTE = ["EUR", "CHF", "USD", "GBP", "JPY", "CAD", "AUD"];

const PERSONAL_SUBTYPES = [
    { value: "STANDARDNI", label: "Standardni" },
    { value: "STEDNI", label: "Štedni" },
    { value: "PENZIONERSKI", label: "Penzionerski" },
    { value: "ZA_MLADE", label: "Za mlade" },
    { value: "ZA_STUDENTE", label: "Za studente" },
    { value: "ZA_NEZAPOSLENE", label: "Za nezaposlene" },
];

const BUSINESS_SUBTYPES = [
    { value: "DOO", label: "DOO" },
    { value: "AD", label: "AD" },
    { value: "FONDACIJA", label: "Fondacija" },
];

/**
 * Props očekivanja (ti uklopi u svoj projekat):
 * - fetchClients: async () => [{ id, fullName, email }]
 * - createAccount: async (payload) => { id, accountNumber } (ili šta već vraća backend)
 * - onCreateNewClient: () => void  (navigacija na kreiranje klijenta)
 * - preselectedClientId: string (ako se vraćaš sa kreiranja klijenta)
 *
 * Napomena: employee se obično uzima iz tokena na backendu, pa ga ovde ne šaljemo.
 */
export default function CreateAccount({
                                          fetchClients,
                                          createAccount,
                                          onCreateNewClient,
                                          preselectedClientId,
                                      }) {
    const [clients, setClients] = useState([]);
    const [loadingClients, setLoadingClients] = useState(false);

    const [kind, setKind] = useState("TEKUCI"); // TEKUCI | DEVIZNI
    const [ownership, setOwnership] = useState("LICNI"); // LICNI | POSLOVNI

    const [ownerClientId, setOwnerClientId] = useState(preselectedClientId || "");

    const [accountName, setAccountName] = useState("");
    const [initialBalance, setInitialBalance] = useState("0");

    const [dailyLimit, setDailyLimit] = useState("");
    const [monthlyLimit, setMonthlyLimit] = useState("");

    const [makeCard, setMakeCard] = useState(false);

    // Tekući podvrste:
    const [currentPersonalSubtype, setCurrentPersonalSubtype] = useState("STANDARDNI");
    const [currentBusinessSubtype, setCurrentBusinessSubtype] = useState("DOO");

    // Devizni:
    const [fxCurrency, setFxCurrency] = useState("EUR");

    // Firma (poslovni):
    const [companyName, setCompanyName] = useState("");
    const [companyRegNumber, setCompanyRegNumber] = useState("");
    const [companyTaxId, setCompanyTaxId] = useState("");
    const [companyIndustryCode, setCompanyIndustryCode] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const currency = useMemo(() => {
        if (kind === "TEKUCI") return "RSD";
        return fxCurrency;
    }, [kind, fxCurrency]);

    const ownerLabel = useMemo(() => {
        const c = clients.find(x => x.id === ownerClientId);
        return c ? `${c.fullName}` : "";
    }, [clients, ownerClientId]);

    useEffect(() => {
        let mounted = true;
        setLoadingClients(true);

        fetchClients()
            .then((data) => {
                if (!mounted) return;
                setClients(data || []);
                if (preselectedClientId) setOwnerClientId(preselectedClientId);
            })
            .catch((e) => {
                if (!mounted) return;
                setFormError(`Ne mogu da učitam klijente. (${String(e)})`);
            })
            .finally(() => {
                if (!mounted) return;
                setLoadingClients(false);
            });

        return () => {
            mounted = false;
        };
    }, [fetchClients, preselectedClientId]);

    function validate() {
        if (!ownerClientId) return "Moraš izabrati vlasnika (Klijenta) ili kreirati novog.";
        if (!accountName.trim()) return "Naziv računa je obavezan.";

        const ib = Number(initialBalance);
        if (Number.isNaN(ib) || ib < 0) return "Početno stanje mora biti broj >= 0.";

        const dl = dailyLimit === "" ? null : Number(dailyLimit);
        if (dl !== null && (Number.isNaN(dl) || dl < 0)) return "Dnevni limit mora biti broj >= 0.";

        const ml = monthlyLimit === "" ? null : Number(monthlyLimit);
        if (ml !== null && (Number.isNaN(ml) || ml < 0)) return "Mesečni limit mora biti broj >= 0.";

        if (kind === "DEVIZNI" && !DEVIZNE_VALUTE.includes(fxCurrency)) {
            return "Devizni račun može biti samo u: EUR, CHF, USD, GBP, JPY, CAD, AUD.";
        }

        if (ownership === "POSLOVNI") {
            if (!companyName.trim()) return "Naziv firme je obavezan (poslovni račun).";
            if (!companyRegNumber.trim()) return "Matični broj firme je obavezan.";
            if (!companyTaxId.trim()) return "PIB firme je obavezan.";
            if (!companyIndustryCode.trim()) return "Šifra delatnosti je obavezna (format xx.xx).";
            if (!/^\d{2}\.\d{2}$/.test(companyIndustryCode.trim())) return "Šifra delatnosti mora biti u formatu xx.xx (npr. 10.10).";
            if (!companyAddress.trim()) return "Adresa firme je obavezna.";
        }

        return null;
    }

    async function onSubmit(e) {
        e.preventDefault();
        setFormError(null);
        setSuccessMsg(null);

        const err = validate();
        if (err) {
            setFormError(err);
            return;
        }

        const payload = {
            kind, // "TEKUCI" | "DEVIZNI"
            ownership, // "LICNI" | "POSLOVNI"
            ownerClientId,
            accountName: accountName.trim(),
            initialBalance: Number(initialBalance),
            currency, // backend može ignorisati za TEKUCI i staviti RSD
            makeCard,

            dailyLimit: dailyLimit === "" ? null : Number(dailyLimit),
            monthlyLimit: monthlyLimit === "" ? null : Number(monthlyLimit),

            currentAccountSubtype:
                kind === "TEKUCI"
                    ? ownership === "LICNI"
                        ? { personal: currentPersonalSubtype }
                        : { business: currentBusinessSubtype }
                    : null,

            company:
                ownership === "POSLOVNI"
                    ? {
                        name: companyName.trim(),
                        registrationNumber: companyRegNumber.trim(),
                        taxId: companyTaxId.trim(),
                        industryCode: companyIndustryCode.trim(),
                        address: companyAddress.trim(),
                    }
                    : null,
        };

        setSubmitting(true);
        try {
            const res = await createAccount(payload);
            const number = res?.accountNumber || res?.account_number || "";
            setSuccessMsg(number ? `Račun uspešno kreiran. Broj računa: ${number}` : "Račun uspešno kreiran.");
            // reset minimal:
            setAccountName("");
            setInitialBalance("0");
            setDailyLimit("");
            setMonthlyLimit("");
            setMakeCard(false);
        } catch (e2) {
            setFormError(`Greška pri kreiranju računa: ${String(e2)}`);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Kreiranje računa</h1>
                    <p className={styles.subtitle}>
                        Račun kreira zaposleni. Nakon uspeha, vlasnik dobija email (backend).
                    </p>
                </div>
            </div>

            <div className={styles.grid}>
                {/* LEFT: forma */}
                <div className={styles.main}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Podaci o računu</div>

                        <form className={styles.form} onSubmit={onSubmit}>
                            {formError && <div className={styles.alertError}>{formError}</div>}
                            {successMsg && <div className={styles.alertOk}>{successMsg}</div>}

                            <div className={styles.row}>
                                <label className={styles.label}>Tip računa</label>
                                <select className={styles.control} value={kind} onChange={(e) => setKind(e.target.value)}>
                                    <option value="TEKUCI">Tekući</option>
                                    <option value="DEVIZNI">Devizni</option>
                                </select>
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>Lični / Poslovni</label>
                                <select className={styles.control} value={ownership} onChange={(e) => setOwnership(e.target.value)}>
                                    <option value="LICNI">Lični</option>
                                    <option value="POSLOVNI">Poslovni</option>
                                </select>
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>Vlasnik (Klijent)</label>
                                <div className={styles.inline}>
                                    <select
                                        className={styles.control}
                                        value={ownerClientId}
                                        onChange={(e) => setOwnerClientId(e.target.value)}
                                        disabled={loadingClients}
                                    >
                                        <option value="">{loadingClients ? "Učitavanje..." : "— Izaberi klijenta —"}</option>
                                        {clients.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.fullName} ({c.email})
                                            </option>
                                        ))}
                                    </select>

                                    {onCreateNewClient && (
                                        <button className={styles.secondaryBtn} type="button" onClick={onCreateNewClient}>
                                            Kreiraj novog
                                        </button>
                                    )}
                                </div>
                                <div className={styles.hint}>
                                    Napomena: možeš izabrati postojećeg klijenta ili kreirati novog (pa se vratiti ovde).
                                </div>
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>Naziv računa</label>
                                <input
                                    className={styles.control}
                                    value={accountName}
                                    onChange={(e) => setAccountName(e.target.value)}
                                    placeholder="npr. Devizni račun 1"
                                />
                            </div>

                            {kind === "TEKUCI" && ownership === "LICNI" && (
                                <div className={styles.row}>
                                    <label className={styles.label}>Podvrsta (tekući - lični)</label>
                                    <select
                                        className={styles.control}
                                        value={currentPersonalSubtype}
                                        onChange={(e) => setCurrentPersonalSubtype(e.target.value)}
                                    >
                                        {PERSONAL_SUBTYPES.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {kind === "TEKUCI" && ownership === "POSLOVNI" && (
                                <div className={styles.row}>
                                    <label className={styles.label}>Podvrsta (tekući - poslovni)</label>
                                    <select
                                        className={styles.control}
                                        value={currentBusinessSubtype}
                                        onChange={(e) => setCurrentBusinessSubtype(e.target.value)}
                                    >
                                        {BUSINESS_SUBTYPES.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {kind === "DEVIZNI" && (
                                <div className={styles.row}>
                                    <label className={styles.label}>Valuta (devizni)</label>
                                    <select className={styles.control} value={fxCurrency} onChange={(e) => setFxCurrency(e.target.value)}>
                                        {DEVIZNE_VALUTE.map((ccy) => (
                                            <option key={ccy} value={ccy}>
                                                {ccy}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={styles.hint}>
                                        Dozvoljene valute: EUR, CHF, USD, GBP, JPY, CAD, AUD. Tekući je uvek RSD.
                                    </div>
                                </div>
                            )}

                            <div className={styles.row}>
                                <label className={styles.label}>Početno stanje</label>
                                <input
                                    className={styles.control}
                                    value={initialBalance}
                                    onChange={(e) => setInitialBalance(e.target.value)}
                                    inputMode="decimal"
                                />
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>Dnevni limit (opciono)</label>
                                <input
                                    className={styles.control}
                                    value={dailyLimit}
                                    onChange={(e) => setDailyLimit(e.target.value)}
                                    inputMode="decimal"
                                    placeholder="npr. 250000"
                                />
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>Mesečni limit (opciono)</label>
                                <input
                                    className={styles.control}
                                    value={monthlyLimit}
                                    onChange={(e) => setMonthlyLimit(e.target.value)}
                                    inputMode="decimal"
                                    placeholder="npr. 1000000"
                                />
                            </div>

                            <div className={styles.row}>
                                <label className={styles.label}>Napravi karticu</label>
                                <label className={styles.checkbox}>
                                    <input type="checkbox" checked={makeCard} onChange={(e) => setMakeCard(e.target.checked)} />
                                    <span>Automatski kreiraj karticu za novi račun (backend)</span>
                                </label>
                            </div>

                            {ownership === "POSLOVNI" && (
                                <>
                                    <div className={styles.sectionTitle}>Firma (informativno)</div>

                                    <div className={styles.row}>
                                        <label className={styles.label}>Naziv firme</label>
                                        <input className={styles.control} value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.label}>Matični broj</label>
                                        <input
                                            className={styles.control}
                                            value={companyRegNumber}
                                            onChange={(e) => setCompanyRegNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.label}>PIB</label>
                                        <input className={styles.control} value={companyTaxId} onChange={(e) => setCompanyTaxId(e.target.value)} />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.label}>Šifra delatnosti (xx.xx)</label>
                                        <input
                                            className={styles.control}
                                            value={companyIndustryCode}
                                            onChange={(e) => setCompanyIndustryCode(e.target.value)}
                                            placeholder="npr. 10.10"
                                        />
                                    </div>

                                    <div className={styles.row}>
                                        <label className={styles.label}>Adresa</label>
                                        <textarea
                                            className={styles.control}
                                            value={companyAddress}
                                            onChange={(e) => setCompanyAddress(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </>
                            )}

                            <div className={styles.actions}>
                                <button className={styles.primaryBtn} type="submit" disabled={submitting}>
                                    {submitting ? "Kreiram..." : "Kreiraj račun"}
                                </button>
                                <button
                                    className={styles.secondaryBtn}
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => {
                                        setFormError(null);
                                        setSuccessMsg(null);
                                        setAccountName("");
                                        setInitialBalance("0");
                                        setDailyLimit("");
                                        setMonthlyLimit("");
                                        setMakeCard(false);
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT: sidebar vizuelni pregled */}
                <div className={styles.sidebar}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Pregled</div>

                        <div className={styles.accountVisual}>
                            <div className={styles.visualType}>
                                {kind === "TEKUCI" ? "TEKUĆI RAČUN" : "DEVIZNI RAČUN"} • {ownership === "LICNI" ? "LIČNI" : "POSLOVNI"}
                            </div>

                            <div className={`${styles.visualOwner} ${!ownerLabel ? styles.placeholder : ""}`}>
                                {ownerLabel || "Izaberi vlasnika (klijenta)"}
                            </div>

                            <div className={styles.visualNumber}>
                                Broj računa: <span className={styles.placeholder}>generiše backend</span>
                            </div>

                            <div className={styles.visualBalances}>
                                <div>
                                    <div className={styles.balLabel}>Početno stanje</div>
                                    <div className={styles.balValue}>
                                        {Number.isFinite(Number(initialBalance))
                                            ? new Intl.NumberFormat("sr-RS", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                                                Number(initialBalance)
                                            )
                                            : "0.00"}{" "}
                                        {currency}
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.balLabel}>Valuta</div>
                                    <div className={styles.balValue}>{currency}</div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Kartica</div>
                            <div className={styles.infoVal}>{makeCard ? "DA" : "NE"}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Dnevni limit</div>
                            <div className={styles.infoVal}>{dailyLimit === "" ? "—" : dailyLimit}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Mesečni limit</div>
                            <div className={styles.infoVal}>{monthlyLimit === "" ? "—" : monthlyLimit}</div>
                        </div>

                        <div className={styles.checklist}>
                            <div className={styles.checkItem}>
                                <span className={styles.checkMark}>•</span>
                                Zaposleni mora biti prijavljen (backend proverava token).
                            </div>
                            <div className={styles.checkItem}>
                                <span className={styles.checkMark}>•</span>
                                Nakon uspeha, vlasnik dobija email (backend).
                            </div>
                            <div className={styles.checkItem}>
                                <span className={styles.checkMark}>•</span>
                                Tekući račun je uvek RSD; devizni je u jednoj valuti.
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>Napomene</div>
                        <div className={styles.infoCardBody}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoBullet} />
                                <div className={styles.infoItemText}>
                                    “Napravi karticu” šalje flag backendu; backend kreira karticu automatski.
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoBullet} />
                                <div className={styles.infoItemText}>
                                    Za poslovni račun unosi se Firma (informativno) i vezuje se za vlasnika.
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoBullet} />
                                <div className={styles.infoItemText}>
                                    “Raspoloživo stanje” i ostali izračunati podaci su backend domen (front prikazuje).
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}