import {
    adminUser,
    loginAs,
    interceptActuaryPortfolio,
    msftStock,
} from './helpers';

/**
 * Scenario 70 – Za akcije postoji opcija javnog režima
 *
 * Given  korisnik poseduje akcije u portfoliju
 * When   otvori detalje akcije u portfoliju (admin / OTC portals)
 * Then   vidi polje za broj akcija u javnom režimu (Qty input)
 * And    može označiti određeni broj akcija kao javne (Public button)
 *
 * Note: the Public mode controls (Qty + Public button) are only visible
 * when the portfolio page is accessed by a user with canManageOTC = true.
 * The adminUser (permissions: ['admin', …]) satisfies this via isSuperAdmin.
 * The admin portfolio is at /portfolio and calls getActuaryPortfolio().
 */
describe('Scenario 70: Za akcije postoji opcija javnog režima', () => {
    beforeEach(() => {
        interceptActuaryPortfolio([msftStock]);
        loginAs(adminUser, '/portfolio');
        cy.wait('@getPortfolio');
    });

    it('prikazuje input za količinu u javnom režimu za svaku akciju', () => {
        // PortfolioTable renders an <input placeholder="Qty"> for OTC when isAdmin=true
        cy.get('input[placeholder="Qty"]').should('exist');
    });

    it('prikazuje dugme Public pored svake akcije', () => {
        cy.contains('button', 'Public').should('be.visible');
    });

    it('prikazuje OTC sekciju sa naslovom za upravljanje javnim akcijama', () => {
        cy.contains(/Upravljanje javnim akcijama/i).should('be.visible');
    });

    it('OTC sekcija prikazuje ticker MSFT', () => {
        // The OTC management table lists all stocks
        cy.contains(/Upravljanje javnim akcijama/i)
            .closest('div')
            .within(() => {
                cy.contains('MSFT').should('exist');
            });
    });

    it('prikazuje dugme za povlačenje sa portala', () => {
        cy.contains('button', /Povuci sa portala/i).should('be.visible');
    });
});