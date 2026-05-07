/**
 * Scenario 72 – Klijent ne vidi opciju iskorišćavanja berzanskih opcija
 * 
 * Given  korisnik je ulogovan kao običan klijent
 * When   otvori svoj portfolio (/client/portfolio)
 * Then   ne vidi dugme EXERCISE
 * And    ne vidi sekciju za upravljanje opcijama i derivatima
 */
describe('Scenario 72: Klijent ne vidi opciju iskorišćavanja berzanskih opcija', () => {
    
    beforeEach(() => {
        // Logujemo se kao običan klijent
        cy.loginAsClient();
        cy.visit('/client/portfolio');
        
        // Čekamo da se stranica učita (proveravamo naslov)
        cy.contains('h1', /Moj Portfolio/i).should('be.visible');
    });

    it('potvrđuje da EXERCISE dugme nije prisutno na stranici', () => {
        // Klijent nikada ne bi smeo da vidi ovo dugme
        cy.contains('button', /EXERCISE/i).should('not.exist');
    });

    it('potvrđuje da sekcija za opcije i derivate nije renderovana', () => {
        // Proveravamo da li su naslovi specifični za opcije sakriveni
        cy.contains(/Opcije i Derivati/i).should('not.exist');
        cy.contains(/Upravljanje opcijama/i).should('not.exist');
    });

    it('proverava da klijentska tabela ne sadrži kolone za izvršavanje opcija', () => {
        // Tabela za klijenta obično ima drugačije kolone od administratorske
        cy.get('table thead').within(() => {
            cy.contains(/Akcije/i).should('not.exist'); // Admin tabela često ima "Akcije" (Actions) kolonu
        });
    });

    it('verifikuje da su prikazane samo osnovne hartije (akcije)', () => {
        // Proveravamo da li tabela postoji, ali ne sadrži elemente rezervisane za opcije
        cy.get('table').should('be.visible').then(($table) => {
            // Proveravamo da u tekstu cele tabele nema ITM/OTM statusa
            expect($table.text()).to.not.match(/ITM|OTM|In The Money|Out of The Money/i);
        });
    });
});