import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 27: Kreiranje ordera ispod minimalne dozvoljene količine', () => {
  it('odbija order i prikazuje poruku o minimalnoj količini', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ ticker: 'MINQ' })]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body.quantity).to.eq(2);
      req.reply({
        statusCode: 400,
        body: { message: 'Minimalna količina za trgovanje je 10.' },
      });
    }).as('createOrder');

    openOrderModal('MINQ');
    fillCommonOrderFields({ quantity: 2 });
    submitOrderAndConfirm();
    cy.contains('button', 'Potvrdi').click();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 400);
    cy.contains(/Minimalna količina za trgovanje je 10\./i).should('be.visible');
  });
});
