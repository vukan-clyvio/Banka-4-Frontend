import {
  setupClientPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, eurClientAccount,
} from './helpers';

// Hartija je u USD, klijent bira EUR račun → sistem vrši konverziju sa provizijom
describe('Scenario 41: Klijent — konverzija novca sa provizijom pri kupovini', () => {
  beforeEach(() => {
    setupClientPage([eurClientAccount]);
  });

  it('klijent bira EUR račun za USD hartiju i order dostiže backend sa tim brojem računa', () => {
    cy.intercept('POST', '**/orders', (req) => {
      // Backend treba da prepozna različite valute i doda proviziju na konverziju
      expect(req.body.account_number).to.eq(eurClientAccount.account_number);
      expect(req.body.direction).to.eq('BUY');
      req.reply({
        statusCode: 201,
        body: { order_id: 1003, status: 'PENDING', after_hours: false },
      });
    }).as('createOrder');

    openOrderModal('Kupi');
    cy.wait('@getAccounts');
    selectAccount(eurClientAccount.account_number);
    setQuantity(2);
    proceedAndConfirm();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
    cy.contains(/order je kreiran|u obradi/i).should('be.visible');
  });
});
