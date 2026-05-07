/**
 * Scenario 36 – SELL order iz portfolija otvara formu za prodaju
 *
 * Given  korisnik ima hartije u portfoliju (stvarni podaci sa backenda)
 * When   klikne na dugme "SELL"
 * Then   otvara se SellOrderModal (forma za SELL)
 * And    može da unese količinu za prodaju
 * And    mora da potvrdi prodaju dodatnim korakom (confirmation step)
 */
describe('Scenario 36: SELL order iz portfolija otvara formu za prodaju', () => {
    
    beforeEach(() => {
        // Koristimo tvoju komandu koja vrši pravi login preko API-ja i čuva sesiju
        cy.loginAsClient();
        
        // Odlazimo direktno na stranicu portfolija
        cy.visit('/client/portfolio');
    });

    it('klik na SELL otvara modal sa SELL formom', () => {
        // Čekamo da se tabela učita sa stvarnim podacima
        cy.get('table').should('be.visible');

        // Klik na prvo dostupno SELL dugme u tabeli
        cy.contains('button', 'SELL').first().should('be.visible').click({ force: true });

        // Provera da li modal sadrži naslov za prodaju
        // Napomena: Pošto su podaci realni, naslov će zavisiti od tikera koji je u bazi
        cy.contains(/Prodaj —|Sell —/i).should('be.visible');
    });

    it('forma sadrži polje za unos količine', () => {
        cy.contains('button', 'SELL').first().click({ force: true });

        // Provera postojanja input polja za količinu
        cy.get(`input[placeholder*="Max"]`).should('exist');
    });

it('unos validne količine i izbor računa omogućava korak za potvrdu', () => {
    // 1. Otvori modal
    cy.contains('button', 'SELL').first().click({ force: true });

    // 2. Selektuj račun - DODATO: Čekanje da se opcije učitaju
    cy.get('select').eq(1).should('be.visible').select(1); // Probaj index 1 ako index 0 ne okida promenu

    // 3. Unesi količinu
    cy.get(`input[placeholder*="Max"]`).clear().type('1');

    // 4. Klikni na Nastavi
    // Proveravamo da dugme nije onemogućeno pre klika
    cy.contains('button', /Nastavi/i).should('not.be.disabled').click({ force: true });

    // 5. Provera naslova ekrana za potvrdu
    // Povećavamo timeout jer backendu možda treba vremena da validira podatke
    cy.contains(/Potvrda/i, { timeout: 7000 }).should('be.visible');
    
    // Provera dugmeta za finalnu potvrdu
    cy.contains('button', /Potvrdi/i).should('be.visible');
});
});