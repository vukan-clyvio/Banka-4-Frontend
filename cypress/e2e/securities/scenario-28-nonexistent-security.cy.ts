import { buildStock, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 28: Kreiranje ordera za nepostojeću hartiju', () => {
  it('odbija zahtev i prikazuje poruku da hartija ne postoji', () => {
    prepareClientSecuritiesPage('stocks', [buildStock({ listing_id: 99999, ticker: 'NEPOSTOJI' })]);

    cy.intercept('POST', '**/orders', (req) => {
      expect(req.body.listing_id).to.eq(99999);
      req.reply({
        statusCode: 404,
        body: { message: 'Hartija ne postoji.' },
      });
    }).as('createOrder');

    openOrderModal('NEPOSTOJI');
    fillCommonOrderFields({ quantity: 1 });
    submitOrderAndConfirm();
    cy.contains('button', 'Potvrdi').click();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 404);
    cy.contains(/Hartija ne postoji\./i).should('be.visible');
  });
});
