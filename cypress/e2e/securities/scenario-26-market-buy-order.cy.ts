import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 26: Market BUY order se kreira kada korisnik unese samo količinu', () => {
  it('otvara market potvrdu, prikazuje napomenu i šalje jedan order tek nakon dodatne potvrde', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ price: 125, ticker: 'ALFA' })]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction: 'BUY',
        order_type: 'MARKET',
        quantity: 4,
        limit_value: 0,
        stop_value: 0,
      });
      req.reply({ statusCode: 201, body: { order_id: 9001, status: 'PENDING' } });
    }).as('createOrder');

    openOrderModal('ALFA');
    fillCommonOrderFields({ quantity: 4 });
    submitOrderAndConfirm();

    cy.contains(/Koristi se tržišna \(market\) cena/i).should('be.visible');
    cy.get('@createOrder.all').should('have.length', 0);

    cy.contains('button', 'Potvrdi').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
  });
});
