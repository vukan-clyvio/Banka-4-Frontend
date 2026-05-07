import {
  setupActuaryPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, usdBankAccount,
} from './helpers';

// Provizija = min(14% * ukupna_cena, 7$)
// Ukupna cena = $25 * 4 = $100 → min($14, $7) = $7
describe('Scenario 39: Provizija Market ordera — naplaćuje se manji iznos', () => {
  beforeEach(() => {
    setupActuaryPage();
  });

  it('aktuar kreira Market BUY order sa ukupnom cenom $100 i order se šalje na backend', () => {
    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction:  'BUY',
        order_type: 'MARKET',
        quantity:   4,
      });
      // Ukupna cena = quantity * price = 4 * 25 = $100
      // Backend treba da naplati proviziju min(14% * 100, 7) = $7
      req.reply({
        statusCode: 201,
        body: {
          order_id:   1001,
          status:     'PENDING',
          after_hours: false,
        },
      });
    }).as('createOrder');

    openOrderModal('Kreiraj nalog');
    selectAccount(usdBankAccount.account_number);
    setQuantity(4);
    proceedAndConfirm();

    cy.wait('@createOrder').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      // Ukupna cena = 4 * $25 = $100
      const body = interception.request.body;
      expect(body.quantity * 25).to.eq(100);
    });

    cy.contains(/order je kreiran|čeka odobrenje/i).should('be.visible');
  });
});
