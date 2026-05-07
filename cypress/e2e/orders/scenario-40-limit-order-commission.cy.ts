import {
  setupActuaryPage, openOrderModal,
  selectAccount, setQuantity, setOrderType, setLimitValue,
  proceedAndConfirm, usdBankAccount,
} from './helpers';

// Provizija = min(24% * početna_cena, 12$)
// Početna cena = limit_value * quantity = $25 * 4 = $100 → min($24, $12) = $12
describe('Scenario 40: Provizija Limit ordera — naplaćuje se manji iznos', () => {
  beforeEach(() => {
    setupActuaryPage();
  });

  it('aktuar kreira Limit BUY order sa početnom cenom $100 i order se šalje na backend', () => {
    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction:   'BUY',
        order_type:  'LIMIT',
        quantity:    4,
        limit_value: 25,
      });
      // Početna cena = quantity * limit_value = 4 * $25 = $100
      // Backend treba da naplati proviziju min(24% * 100, 12) = $12
      req.reply({
        statusCode: 201,
        body: { order_id: 1002, status: 'PENDING', after_hours: false },
      });
    }).as('createOrder');

    openOrderModal('Kreiraj nalog');
    setOrderType('Limit');
    setLimitValue(25);
    selectAccount(usdBankAccount.account_number);
    setQuantity(4);
    proceedAndConfirm();

    cy.wait('@createOrder').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      const body = interception.request.body;
      // Početna cena = quantity * limit_value = $100
      expect(body.quantity * body.limit_value).to.eq(100);
    });

    cy.contains(/order je kreiran|čeka odobrenje/i).should('be.visible');
  });
});
