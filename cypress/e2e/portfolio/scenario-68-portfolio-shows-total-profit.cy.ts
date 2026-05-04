import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    msftStock,
} from './helpers';

/**
 * Scenario 68 – Portfolio prikazuje ukupan profit
 *
 * Given  korisnik ima otvorene pozicije u portfoliju
 * When   otvori portal "Moj portfolio"
 * Then   vidi ukupan profit/gubitak za sve pozicije koje trenutno drži
 */
describe('Scenario 68: Portfolio prikazuje ukupan profit', () => {
    it('prikazuje sekciju sa ukupnim profitom/gubitkom', () => {
        // msftStock has profit: 5000 → total profit = 5000 (positive)
        interceptClientPortfolio([msftStock]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');

        cy.contains(/Ukupan Profit \/ Gubitak/i).should('be.visible');
    });

    it('prikazuje pozitivan profit kao pozitivan broj sa simbolom ▲', () => {
        interceptClientPortfolio([msftStock]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');

        // ProfitSummary renders ▲ for positive total profit
        cy.contains('▲').should('be.visible');
    });

    it('prikazuje negativan profit kao negativan broj sa simbolom ▼', () => {
        const losingAsset = { ...msftStock, profit: -3_000 };
        interceptClientPortfolio([losingAsset]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');

        cy.contains('▼').should('be.visible');
    });

    it('prikazuje broj aktivnih hartija', () => {
        interceptClientPortfolio([msftStock]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');

        cy.contains(/Aktivne hartije/i).should('be.visible');
        cy.contains('1 stavki').should('be.visible');
    });
});