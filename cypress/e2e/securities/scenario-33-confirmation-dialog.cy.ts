import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 33: Dijalog potvrde prikazuje sve obavezne informacije', () => {
  it('prikazuje broj hartija, tip ordera i približnu ukupnu cenu pre finalne potvrde', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ ticker: 'CONF' })]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body).to.deep.include({
        direction: 'BUY',
        order_type: 'MARKET',
        quantity: 6,
        limit_value: 0,
        stop_value: 0,
      });
      req.reply({ statusCode: 201, body: { order_id: 9006, status: 'PENDING' } });
    }).as('createOrder');

    openOrderModal('CONF');
    fillCommonOrderFields({ quantity: 6 });
    submitOrderAndConfirm();

    cy.contains(/Broj hartija:/i).parent().contains('strong', '6').should('be.visible');
    cy.contains(/Tip ordera:/i).parent().contains(/Market/i).should('be.visible');
    cy.contains(/Približna ukupna cena:/i).should('be.visible');
    cy.contains('button', 'Potvrdi').should('be.visible');

    cy.get('@createOrder.all').should('have.length', 0);
    cy.contains('button', 'Potvrdi').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
  });
});
