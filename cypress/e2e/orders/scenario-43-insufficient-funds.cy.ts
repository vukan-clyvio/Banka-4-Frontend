import {
  setupClientPage, openOrderModal,
  selectAccount, setQuantity,
  emptyClientAccount,
} from './helpers';

// Klijentov račun ima $0, order bi koštao 4 * $25 = $100
describe('Scenario 43: Kreiranje BUY ordera bez dovoljno sredstava', () => {
  beforeEach(() => {
    setupClientPage([emptyClientAccount]);
  });

  it('prikazuje grešku o nedovoljnom stanju i ne šalje order na backend', () => {
    cy.intercept('POST', '**/orders').as('createOrder');

    openOrderModal('Kupi');
    cy.wait('@getAccounts');
    selectAccount(emptyClientAccount.account_number);
    setQuantity(4);

    cy.contains('button', 'Nastavi').scrollIntoView().click({ force: true });

    // Forma ne sme da napreduje — ne prikazuje "Potvrda ordera"
    cy.contains('h4', 'Potvrda ordera').should('not.exist');
    // Prikazuje poruku o nedovoljnom stanju
    cy.contains(/nedovoljno sredstava/i).should('be.visible');
    // API ne sme biti pozvan
    cy.get('@createOrder.all').should('have.length', 0);
  });
});
