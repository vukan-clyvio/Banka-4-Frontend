import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    interceptClientAccounts,
    msftStock,
} from './helpers';

/**
 * Scenario 36 – SELL order iz portfolija otvara formu za prodaju
 *
 * Given  korisnik ima hartije u portfoliju
 * When   klikne na dugme "SELL"
 * Then   otvara se SellOrderModal (forma za SELL)
 * And    može da unese količinu za prodaju
 * And    mora da potvrdi prodaju dodatnim korakom (confirmation step)
 */
describe('Scenario 36: SELL order iz portfolija otvara formu za prodaju', () => {
    beforeEach(() => {
        interceptClientAccounts();
        interceptClientPortfolio([msftStock]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('klik na SELL otvara modal sa SELL formom', () => {
        // SELL button is rendered in the portfolio table
        cy.contains('button', 'SELL').first().should('be.visible').click({ force: true });

        // Modal header shows the ticker
        cy.contains('Prodaj — MSFT').should('be.visible');
    });

    it('forma sadrži polje za unos količine', () => {
        cy.contains('button', 'SELL').first().click({ force: true });

        // Quantity input is rendered in the modal form
        cy.get(`input[placeholder*="Max"]`).should('exist');
    });

    it('unos validne količine i izbor računa omogućava korak za potvrdu', () => {
        cy.contains('button', 'SELL').first().click({ force: true });
        cy.wait('@getAccounts');

        // Select the account (second <select> in the form – first is order type)
        cy.get('select').eq(1).select('1234567890');

        // Enter a valid quantity (less than or equal to owned amount)
        cy.get(`input[placeholder*="Max"]`).type('5');

        // Nastavi (Proceed) button is enabled
        cy.contains('button', 'Nastavi').should('not.be.disabled').click({ force: true });

        // Confirmation screen must be shown
        cy.contains('Potvrda prodaje').should('be.visible');
        cy.contains('button', 'Potvrdi prodaju').should('be.visible');

        // Summary displays the ticker and chosen quantity
        cy.contains('MSFT').should('be.visible');
        cy.contains('5').should('be.visible');
    });
});