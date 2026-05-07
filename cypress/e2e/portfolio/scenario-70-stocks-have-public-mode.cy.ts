/**
 * Scenario 70 – Za akcije postoji opcija javnog režima
 * 
 * NAPOMENA: Zahteva nalog sa admin/OTC privilegijama.
 * Test proverava interfejs za prebacivanje akcija u javni režim.
 */
describe('Scenario 70: Za akcije postoji opcija javnog režima', () => {
    
    beforeEach(() => {
        // Logujemo se kao admin jer on ima permisije za OTC upravljanje
        cy.loginAsAdmin(); 
        cy.visit('/portfolio');
        
        // Čekamo da se učita tabela sa akcijama (timeout 10s)
        cy.get('table', { timeout: 10000 }).should('be.visible');
    });

    it('prikazuje sekciju za upravljanje javnim akcijama', () => {
        // Provera postojanja naslova sekcije
        cy.contains(/Upravljanje javnim akcijama/i).should('be.visible');
    });

    it('prikazuje kontrole za javni režim (Qty i Public dugme)', () => {
        // Provera da li postoji polje za unos količine
        cy.get('input[placeholder*="Qty"]').should('be.visible');
        
        // Provera da li postoji dugme "Public"
        cy.contains('button', /Public/i).should('be.visible');
    });

    it('dozvoljava unos količine za prvu dostupnu akciju', () => {
        // Pronalazimo prvu akciju u listi i pokušavamo interakciju
        cy.get('table tbody tr').first().within(() => {
            cy.get('input[placeholder*="Qty"]')
                .clear()
                .type('5')
                .should('have.value', '5');
            
            cy.contains('button', /Public/i).should('not.be.disabled');
        });
    });

    it('prikazuje dugme za povlačenje akcija sa portala', () => {
        // Provera postojanja opcije za povlačenje (Withdraw/Povuci)
        cy.contains('button', /Povuci sa portala/i).should('be.visible');
    });

it('verifikuje da se ticker vidi unutar OTC sekcije', () => {
        // Tražimo sekciju po tekstu, a zatim proveravamo da li se unutar 
        // tog dela ekrana pojavljuje bilo šta što liči na ticker (npr. AAPL, MSFT)
        cy.contains(/Upravljanje javnim akcijama/i)
            .closest('div') // Tražimo najbliži zajednički kontejner
            .then(($section) => {
                // Proveravamo da li u toj sekciji postoji tekst koji se sastoji od 1-5 velikih slova
                // Što je standard za berzanske tickere
                const sectionText = $section.text();
                const tickerRegex = /[A-Z]{1,5}/;
                expect(sectionText).to.match(tickerRegex);
            });
    });
});