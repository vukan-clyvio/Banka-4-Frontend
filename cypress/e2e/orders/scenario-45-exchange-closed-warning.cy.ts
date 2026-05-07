import {
  setupClientPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, usdClientAccount,
} from './helpers';

// Berza je potpuno zatvorena — backend vraća after_hours: true
// UI prikazuje upozorenje nakon kreiranja ordera
describe('Scenario 45: Upozorenje kada je berza zatvorena', () => {
  beforeEach(() => {
    setupClientPage([usdClientAccount]);
  });

  it('prikazuje poruku da će order biti izvršen kada berza otvori', () => {
    cy.intercept('POST', '**/orders', {
      statusCode: 201,
      body: {
        order_id:    1005,
        status:      'PENDING',
        after_hours: true,
      },
    }).as('createOrder');

    openOrderModal('Kupi');
    cy.wait('@getAccounts');
    selectAccount(usdClientAccount.account_number);
    setQuantity(2);
    proceedAndConfirm();

    cy.wait('@createOrder');
    cy.contains(/izvršiće se kada berza otvori|berza.*zatvorena|tržište.*zatvoreno/i).should('be.visible');
  });
});
