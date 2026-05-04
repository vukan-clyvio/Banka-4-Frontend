import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    interceptClientAccounts,
    msftStock,
} from './helpers';

/**
 * Scenario 38 – Prodaja tačnog broja hartija
 *
 * Given  korisnik ima 10 akcija u portfoliju
 * When   kreira SELL order za 10 akcija (tačno koliko poseduje)
 * Then   order je dozvoljen – nema validacione greške
 * And    nakon potvrde sell order se uspešno šalje (success banner)
 */
describe('Scenario 38: Prodaja tačnog broja hartija', () => {
    beforeEach(() => {
        interceptClientAccounts();
        // msftStock has amount: 10
        interceptClientPortfolio([msftStock]);

        // Intercept the SELL order POST (tradingApi POST /orders)
        cy.intercept('POST', /\/orders/, {
            statusCode: 200,
            body: { id: 999, direction: 'SELL', status: 'PENDING' },
        }).as('postSellOrder');

        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('nema validacione greške kada korisnik upiše tačan broj akcija', () => {
        cy.contains('button', 'SELL').first().click({ force: true });
        cy.get(`input[placeholder*="Max"]`).type('10');

        // No error message
        cy.contains(/Nemate dovoljno/i).should('not.exist');

        // Submit button is enabled
        cy.contains('button', 'Nastavi').should('not.be.disabled');
    });

    it('order se uspešno šalje i prikazuje se success banner', () => {
        cy.contains('button', 'SELL').first().click({ force: true });
        cy.wait('@getAccounts');

        // Select account and enter the exact owned quantity
        cy.get('select').eq(1).select('1234567890');
        cy.get(`input[placeholder*="Max"]`).type('10');

        // Proceed to confirmation
        cy.contains('button', 'Nastavi').click({ force: true });
        cy.contains('Potvrda prodaje').should('be.visible');

        // Confirm the sell
        cy.contains('button', 'Potvrdi prodaju').click({ force: true });
        cy.wait('@postSellOrder').its('response.statusCode').should('eq', 200);

        // Success banner must be shown
        cy.contains(/Sell order je kreiran i u obradi/i).should('be.visible');
    });
});