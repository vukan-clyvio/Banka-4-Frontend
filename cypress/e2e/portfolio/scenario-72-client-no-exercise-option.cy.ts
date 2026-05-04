import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    msftStock,
    msftOptionITM,
} from './helpers';

/**
 * Scenario 72 – Klijent ne vidi opciju iskorišćavanja berzanskih opcija
 *
 * Given  korisnik je klijent
 * When   otvori portfolio
 * Then   ne postoji opcija za iskorišćavanje opcija (EXERCISE dugme)
 *
 * Reason: ClientPortfolioPage filters out assets where type === 'OPTION' before
 * passing them to PortfolioTable, and never renders the OptionsSection component.
 * Therefore no EXERCISE button is ever visible to a client.
 */
describe('Scenario 72: Klijent ne vidi opciju iskorišćavanja berzanskih opcija', () => {
    beforeEach(() => {
        // Include an ITM option in the mock response – it must be hidden from the client
        interceptClientPortfolio([msftStock, msftOptionITM]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('EXERCISE dugme nije prikazano na klijentskom portfoliju', () => {
        cy.contains('button', 'EXERCISE').should('not.exist');
    });

    it('opcije (OPTION) se ne prikazuju u tabeli klijentskog portfolija', () => {
        // The client table must not show the option ticker
        cy.contains('td', msftOptionITM.ticker).should('not.exist');
    });

    it('OptionsSection (tabela opcija) se ne renderuje za klijenta', () => {
        // The options section heading is only rendered on the admin/actuary portfolio page
        cy.contains(/Opcije i Derivati/i).should('not.exist');
    });
});