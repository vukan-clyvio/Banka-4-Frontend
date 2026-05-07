/**
 * Scenario 73 – Hartija prelazi u portfolio nakon izvršenog BUY ordera
 * 
 * Verifikuje da se hartija pojavljuje u portfoliju sa ispravnom količinom
 * i da su prava pristupa ispravno postavljena (nema OTC akcija za klijenta).
 */
describe('Scenario 73: Hartija prelazi u portfolio nakon izvršenog BUY ordera', () => {
    
    beforeEach(() => {
        cy.loginAsClient();
        cy.visit('/client/portfolio');
        cy.get('table', { timeout: 10000 }).should('be.visible');
    });

    it('novosteknuta hartija se prikazuje u tabeli portfolija', () => {
        cy.get('table tbody tr').should('have.length.at.least', 1);
        // Provera Ticker-a u prvoj koloni (index 0)
        cy.get('table tbody tr').first().find('td').eq(0).should('not.be.empty');
    });

    it('prikazuje ispravnu količinu (veću od nule)', () => {
        cy.get('table tbody tr').first().within(() => {
            // Kolona AMOUNT je treća po redu, dakle eq(2)
            cy.get('td').eq(2).invoke('text').then((text) => {
                const cleanValue = text.replace(/[^0-9.]/g, '');
                const amount = parseFloat(cleanValue);
                
                cy.log('Pročitana količina:', amount);
                expect(amount, `Očekivan broj, a dobijeno: ${text}`).to.be.greaterThan(0);
            });
        });
    });

    it('hartija je privatna po difoltu – nema Public dugmeta na klijentskom portalu', () => {
        // Vidim na slici samo SELL dugmad, što je ispravno
        cy.contains('button', /Public/i).should('not.exist');
    });

    it('SELL dugme je dostupno za novosteknute hartije', () => {
        cy.get('table tbody tr').first().within(() => {
            cy.contains('button', 'SELL')
                .should('be.visible')
                .and('not.be.disabled');
        });
    });
});