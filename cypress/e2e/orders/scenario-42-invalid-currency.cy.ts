import {
  setupClientPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, usdClientAccount,
} from './helpers';

describe('Scenario 42: Kreiranje ordera sa nevalidnom valutom računa', () => {
  beforeEach(() => {
    setupClientPage([usdClientAccount]);
  });

  it('backend odbija order zbog nevalidne valute i greška se prikazuje u modalu', () => {
    cy.intercept('POST', '**/orders', {
      statusCode: 400,
      body: { message: 'Valuta računa nije podržana za ovu hartiju.' },
    }).as('createOrder');

    openOrderModal('Kupi');
    cy.wait('@getAccounts');
    selectAccount(usdClientAccount.account_number);
    setQuantity(2);
    proceedAndConfirm();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 400);
    cy.contains(/valut|nije podržan|nevalidn/i).should('be.visible');
  });
});
