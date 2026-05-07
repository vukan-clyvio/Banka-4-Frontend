/**
 * Scenario 68 – Portfolio prikazuje ukupan profit
 * 
 * Given  korisnik ima otvorene pozicije u portfoliju
 * When   otvori portal "Moj portfolio"
 * Then   vidi ukupan profit/gubitak za sve pozicije koje trenutno drži
 */
/**
 * Scenario 68 – Portfolio prikazuje ukupan profit
 */
describe('Scenario 68: Portfolio prikazuje ukupan profit', () => {
    
    beforeEach(() => {
        cy.loginAsClient();
        cy.visit('/client/portfolio');
        // Čekamo da se naslov pojavi kao potvrda da je stranica učitana
        cy.contains('h1', /Moj Portfolio/i).should('be.visible');
    });

    it('prikazuje sekciju sa ukupnim profitom i broj stavki', () => {
        cy.contains(/Ukupan Profit \/ Gubitak/i).should('be.visible');
        cy.contains(/Aktivne hartije/i).should('be.visible');
        cy.contains(/\d+ stavki/).should('be.visible');
    });

    it('validira logiku simbola (▲/▼) u odnosu na realni profit', () => {
        // Tražimo element koji sadrži tekst "Ukupan Profit / Gubitak"
        // a zatim gledamo njegovog roditelja ili susedni element gde je broj
        cy.contains(/Ukupan Profit \/ Gubitak/i)
            .parent() 
            .then(($parent) => {
                const text = $parent.text();
                // Izvlačimo broj (uključujući minus i decimalnu tačku)
                const profitValue = parseFloat(text.replace(/[^0-9.-]+/g, ""));

                if (profitValue > 0) {
                    cy.wrap($parent).should('contain', '▲');
                } else if (profitValue < 0) {
                    cy.wrap($parent).should('contain', '▼');
                } else {
                    cy.log('Profit je 0, proveravam samo vidljivost');
                    cy.wrap($parent).should('be.visible');
                }
            });
    });

    it('proverava da se ukupan profit prikazuje pored labele', () => {
        // Umesto h2, tražimo bilo koji element koji sadrži broj pored labele
        cy.contains(/Ukupan Profit \/ Gubitak/i)
            .parent()
            .invoke('text')
            .should('match', /[0-9]/); // Proveravamo da li unutar roditelja ima bar jedna cifra
    });
});