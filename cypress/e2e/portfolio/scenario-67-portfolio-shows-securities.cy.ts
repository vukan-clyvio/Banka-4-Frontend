import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    msftStock,
} from './helpers';

/**
 * Scenario 67 – Portfolio prikazuje listu posedovanih hartija
 *
 * Given  korisnik poseduje hartije od vrednosti
 * When   otvori portal "Moj portfolio"
 * Then   vidi spisak hartija
 * And    za svaku vidi tip hartije, ticker, amount, price, profit i last modified
 */
describe('Scenario 67: Portfolio prikazuje listu posedovanih hartija', () => {
    beforeEach(() => {
        interceptClientPortfolio([msftStock]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('prikazuje naslov stranice Moj Portfolio', () => {
        cy.contains('h1', 'Moj Portfolio').should('be.visible');
    });

    it('prikazuje red sa tickerom MSFT u tabeli hartija', () => {
        cy.contains('td', 'MSFT').should('be.visible');
    });

    it('prikazuje tip hartije (STOCK)', () => {
        cy.contains('td', 'STOCK').should('be.visible');
    });

    it('prikazuje amount (količinu) hartije', () => {
        cy.contains('td', String(msftStock.amount)).should('be.visible');
    });

    it('tabela ima kolonske naslove TICKER, TYPE, AMOUNT, PRICE, PROFIT, LAST MODIFIED', () => {
        cy.contains('th', 'TICKER').should('be.visible');
        cy.contains('th', 'TYPE').should('be.visible');
        cy.contains('th', 'AMOUNT').should('be.visible');
        cy.contains('th', 'PRICE').should('be.visible');
        cy.contains('th', 'PROFIT').should('be.visible');
        cy.contains('th', 'LAST MODIFIED').should('be.visible');
    });

    it('prikazuje dugme SELL za svaku hartiju', () => {
        cy.contains('button', 'SELL').should('be.visible');
    });
});