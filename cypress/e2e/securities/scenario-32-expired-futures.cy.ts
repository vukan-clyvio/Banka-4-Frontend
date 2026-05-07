import { buildFutures, buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields } from './helpers';

describe('Scenario 32: Kreiranje ordera za futures ugovor sa isteklim datumom', () => {
  it('odbija order pre slanja kada je futures ugovor istekao', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ ticker: 'TEMP' })]);

    cy.intercept('GET', '**/listings/futures*', {
      statusCode: 200,
      body: { data: [buildFutures()] },
    }).as('getFutures');

    cy.contains('button', 'Futures').click();
    cy.wait('@getFutures');

    cy.intercept('POST', '**/orders', {
      statusCode: 201,
      body: { order_id: 9005, status: 'PENDING' },
    }).as('createOrder');

    openOrderModal('CLZ26');
    fillCommonOrderFields({ quantity: 1 });
    cy.contains('button', 'Nastavi').click();

    cy.contains(/futures ugovor je istekao/i).should('be.visible');
    cy.get('@createOrder.all').should('have.length', 0);
  });
});
