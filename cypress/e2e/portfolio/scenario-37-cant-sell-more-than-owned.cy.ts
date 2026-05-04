import {
    clientUser,
    loginAs,
    interceptClientPortfolio,
    interceptClientAccounts,
    msftStock,
} from './helpers';

/**
 * Scenario 37 – Korisnik ne može prodati više hartija nego što poseduje
 *
 * Given  korisnik ima 10 akcija MSFT u portfoliju
 * When   pokuša da kreira SELL order za 15 akcija
 * Then   sistem prikazuje validacionu grešku
 * And    order se ne može poslati (Nastavi je disabled)
 */
describe('Scenario 37: Korisnik ne može prodati više hartija nego što poseduje', () => {
    beforeEach(() => {
        interceptClientAccounts();
        // msftStock has amount: 10
        interceptClientPortfolio([msftStock]);
        loginAs(clientUser, '/client/portfolio');
        cy.wait('@getPortfolio');
    });

    it('prikazuje grešku kada korisnik upiše više od posedovanog broja akcija', () => {
        cy.contains('button', 'SELL').first().click({ force: true });

        // Enter a quantity that exceeds the owned amount (10)
        cy.get(`input[placeholder*="Max"]`).type('15');

        // Validation error message must appear
        cy.contains(/Nemate dovoljno\. Posedujete: 10\./i).should('be.visible');
    });

    it('dugme Nastavi je onemogućeno kada je količina veća od posedovane', () => {
        cy.contains('button', 'SELL').first().click({ force: true });
        cy.get(`input[placeholder*="Max"]`).type('15');

        // The submit button must be disabled so the order cannot be sent
        cy.contains('button', 'Nastavi').should('be.disabled');
    });

    it('forma ne prelazi na korak za potvrdu kada je količina prevelika', () => {
        cy.contains('button', 'SELL').first().click({ force: true });
        cy.get(`input[placeholder*="Max"]`).type('15');

        // Even a forced click must not advance to the confirmation screen
        cy.contains('button', 'Nastavi').click({ force: true });
        cy.contains('Potvrda prodaje').should('not.exist');
    });
});