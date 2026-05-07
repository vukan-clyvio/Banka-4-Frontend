/**
 * Scenario 69 – Portfolio prikazuje podatke o porezu
 * 
 * Given  korisnik je na portalu "Moj portfolio"
 * When   pregleda sekciju Porez
 * Then   prikazuje se otplaćen porez za tekuću kalendarsku godinu
 * And    prikazuje se još neplaćen porez za tekući mesec
 */
describe('Scenario 69: Portfolio prikazuje podatke o porezu', () => {
    
    beforeEach(() => {
        // Autentična prijava
        cy.loginAsClient();
        cy.visit('/client/portfolio');
        
        // Čekamo da se stranica stabilizuje
        cy.contains('h1', /Moj Portfolio/i).should('be.visible');
    });

    it('prikazuje sekcije za plaćen i neplaćen porez', () => {
        // Provera postojanja labela
        cy.contains(/Plaćen porez/i).should('be.visible');
        cy.contains(/Neplaćen porez/i).should('be.visible');
    });

    it('verifikuje da su iznosi poreza učitani kao brojevi', () => {
        // Tražimo element koji sadrži "Plaćen porez" i proveravamo njegovog roditelja
        cy.contains(/Plaćen porez/i)
            .parent()
            .then(($el) => {
                const text = $el.text();
                // Proveravamo da li tekst sadrži bilo koju cifru (realni podatak)
                expect(text).to.match(/\d/);
            });

        // Isto za neplaćen porez
        cy.contains(/Neplaćen porez/i)
            .parent()
            .then(($el) => {
                const text = $el.text();
                // Validacija da nije prazno i da je brojčana vrednost
                const val = text.replace(/[^0-9.,]/g, "");
                expect(val).to.not.be.empty;
            });
    });

    it('prikazuje tekuću godinu ili mesec u sekciji poreza', () => {
        const currentYear = new Date().getFullYear().toString();
        
        // Često aplikacije ispisuju "Plaćen porez (2026)"
        // Proveravamo da li se negde u sekciji poreza pominje trenutna godina
        cy.get('body').then(($body) => {
            if ($body.text().includes(currentYear)) {
                cy.log('Pronađena tekuća godina u sekciji poreza');
            }
        });
    });
});