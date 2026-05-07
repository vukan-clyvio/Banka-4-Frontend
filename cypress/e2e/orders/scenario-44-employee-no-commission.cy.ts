import {
  setupActuaryPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, eurBankAccount,
} from './helpers';

// Aktuar bira EUR bankini račun za USD hartiju → konverzija BEZ provizije
describe('Scenario 44: Zaposleni — konverzija novca bez provizije pri kupovini', () => {
  beforeEach(() => {
    setupActuaryPage([eurBankAccount]);
  });

  it('aktuar bira EUR bankini račun za USD hartiju i order dostiže backend', () => {
    cy.intercept('POST', '**/orders', (req) => {
      // Aktuar koristi bankini EUR račun — backend ne naplaćuje proviziju na konverziju
      expect(req.body.account_number).to.eq(eurBankAccount.account_number);
      expect(req.body.direction).to.eq('BUY');
      req.reply({
        statusCode: 201,
        body: { order_id: 1004, status: 'PENDING', after_hours: false },
      });
    }).as('createOrder');

    openOrderModal('Kreiraj nalog');
    selectAccount(eurBankAccount.account_number);
    setQuantity(4);
    proceedAndConfirm();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
    cy.contains(/order je kreiran|čeka odobrenje/i).should('be.visible');
  });
});
