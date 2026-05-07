import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 29: Limit BUY order se kreira kada je unet limit', () => {
  it('šalje limit order i potvrda prikazuje limit cenu i približnu ukupnu cenu', () => {
    const stock = buildStock({ ticker: 'LIMT', price: 137.5 });
    prepareClientSecuritiesPage('stocks', [stock]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction: 'BUY',
        order_type: 'LIMIT',
        quantity: 4,
        limit_value: 137.5,
        stop_value: 0,
      });
      req.reply({ statusCode: 201, body: { order_id: 9002, status: 'PENDING' } });
    }).as('createOrder');

    openOrderModal('LIMT');
    fillCommonOrderFields({ orderType: 'Limit', quantity: 4, limitValue: 137.5 });
    submitOrderAndConfirm();

    cy.contains(/Tip ordera:/i).parent().contains(/Limit/i).should('be.visible');
    cy.contains(/Limit cena:/i).parent().contains('strong', '137,50 USD').should('be.visible');
    cy.contains(/Približna ukupna cena:/i).parent().contains('strong', '550,00 USD').should('be.visible');

    cy.contains('button', 'Potvrdi').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
  });
});
