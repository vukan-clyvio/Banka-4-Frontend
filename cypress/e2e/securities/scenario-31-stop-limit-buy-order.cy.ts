import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 31: Stop-Limit BUY order se kreira kada su uneti stop i limit', () => {
  it('prikazuje obe vrednosti i šalje stop-limit order', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ ticker: 'SLMT', price: 150 })]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction: 'BUY',
        order_type: 'STOP_LIMIT',
        quantity: 2,
        limit_value: 149,
        stop_value: 151,
      });
      req.reply({ statusCode: 201, body: { order_id: 9004, status: 'PENDING' } });
    }).as('createOrder');

    openOrderModal('SLMT');
    fillCommonOrderFields({ orderType: 'Stop Limit', quantity: 2, limitValue: 149, stopValue: 151 });
    submitOrderAndConfirm();

    cy.contains(/Tip ordera:/i).parent().contains(/Stop Limit/i).should('be.visible');
    cy.contains(/Limit cena:/i).parent().contains('strong', '149,00 USD').should('be.visible');
    cy.contains(/Stop cena:/i).parent().contains('strong', '151,00 USD').should('be.visible');

    cy.contains('button', 'Potvrdi').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
  });
});
