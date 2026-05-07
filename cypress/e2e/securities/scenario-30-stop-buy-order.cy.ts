import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 30: Stop BUY order se kreira kada je unet stop', () => {
  it('šalje stop order sa stop vrednošću i bez limit cene', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ ticker: 'STOP' })]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction: 'BUY',
        order_type: 'STOP',
        quantity: 3,
        limit_value: 0,
        stop_value: 141,
      });
      req.reply({ statusCode: 201, body: { order_id: 9003, status: 'PENDING' } });
    }).as('createOrder');

    openOrderModal('STOP');
    fillCommonOrderFields({ orderType: 'Stop', quantity: 3, stopValue: 141 });
    submitOrderAndConfirm();

    cy.contains(/Tip ordera:/i).parent().contains(/Stop/i).should('be.visible');
    cy.contains(/Stop cena:/i).parent().contains('strong', '141,00 USD').should('be.visible');

    cy.contains('button', 'Potvrdi').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
  });
});
