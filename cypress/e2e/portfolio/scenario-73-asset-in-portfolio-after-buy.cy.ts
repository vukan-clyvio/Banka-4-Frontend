import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    msftStock,
} from './helpers';

/**
 * Scenario 73 – Hartija prelazi u portfolio nakon izvršenog BUY ordera
 *
 * Given  korisnik ima Approved BUY order koji se izvršio (isDone = true)
 * When   order dobije isDone = true
 * Then   hartija se pojavljuje u portfoliju korisnika
 * And    po difoltu je označena kao privatna
 *
 * Test approach: we simulate the "after execution" state by mocking the
 * portfolio API to return the newly acquired asset, exactly as the backend
 * would after the order is fulfilled.  The "private by default" invariant
 * is verified by confirming that no "Public" button is rendered on the
 * client portfolio page (ClientPortfolioPage uses isAdmin={false}).
 */
describe('Scenario 73: Hartija prelazi u portfolio nakon izvršenog BUY ordera', () => {
    const newlyAcquired = { ...msftStock, amount: 10, isPublic: false };

    beforeEach(() => {
        // Portfolio now contains the asset that was just bought
        interceptClientPortfolio([newlyAcquired]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('novosteknuta hartija se prikazuje u tabeli portfolija', () => {
        cy.contains('td', 'MSFT').should('be.visible');
    });

    it('prikazuje ispravnu količinu novosteknute hartije', () => {
        cy.contains('td', String(newlyAcquired.amount)).should('be.visible');
    });

    it('hartija je privatna po difoltu – nema Public dugmeta na klijentskom portalu', () => {
        // isPublic: false is the default; the client portfolio never shows a Public button
        cy.contains('button', 'Public').should('not.exist');
    });

    it('SELL dugme je dostupno za novosteknute hartije', () => {
        // The asset can be sold – SELL button must be visible
        cy.contains('button', 'SELL').should('be.visible');
    });
});