import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    msftStock,
} from './helpers';

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
        interceptClientPortfolio([msftStock], { taxPaid: 1_200, taxUnpaid: 350 });
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('prikazuje sekciju za plaćen porez', () => {
        // TaxSummary renders "Plaćen porez (YYYY)"
        cy.contains(/Plaćen porez/i).should('be.visible');
    });

    it('prikazuje iznos plaćenog poreza', () => {
        cy.contains('$1,200').should('be.visible');
    });

    it('prikazuje sekciju za neplaćen porez', () => {
        cy.contains(/Neplaćen porez/i).should('be.visible');
    });

    it('prikazuje iznos neplaćenog poreza', () => {
        cy.contains('$350').should('be.visible');
    });
});