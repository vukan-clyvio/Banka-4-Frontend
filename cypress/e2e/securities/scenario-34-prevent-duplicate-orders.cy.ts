import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 34: Sprečavanje duplog slanja ordera', () => {
  it('kreira samo jedan order i ignoriše dodatne klikove na potvrdu', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ ticker: 'ONCE' })]);

    let createOrderCalls = 0;

    cy.intercept('POST', '**/orders', (req) => {
      createOrderCalls += 1;
      req.reply({
        delay: 800,
        statusCode: 201,
        body: { order_id: 9007, status: 'PENDING' },
      });
    }).as('createOrder');

    openOrderModal('ONCE');
    fillCommonOrderFields({ quantity: 5 });
    submitOrderAndConfirm();

    cy.contains('button', 'Potvrdi').dblclick({ force: true });
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
    cy.wrap(null).then(() => {
      expect(createOrderCalls).to.eq(1);
    });
  });
});
