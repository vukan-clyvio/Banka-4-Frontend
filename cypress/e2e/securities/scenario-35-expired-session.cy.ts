import { buildStock, primaryAccount, prepareClientSecuritiesPage, openOrderModal, fillCommonOrderFields, submitOrderAndConfirm } from './helpers';

describe('Scenario 35: Kreiranje ordera sa isteklom sesijom', () => {
  it('vraća korisnika na login i ne ostavlja kreiran order', () => {
    const expiredSessionUser = {
      id: 77,
      client_id: 77,
      first_name: 'Ivana',
      last_name: 'Klijent',
      identity_type: 'client',
      permissions: [],
    };

    cy.intercept('GET', '**/listings/stocks*', {
      statusCode: 200,
      body: { data: [buildStock({ ticker: 'EXPR' })] },
    }).as('getListings');

    cy.intercept('GET', '**/clients/*/accounts*', {
      statusCode: 200,
      body: { data: [primaryAccount] },
    }).as('getAccounts');

    cy.intercept('GET', '**/clients/*/loans*', {
      statusCode: 200,
      body: { data: [] },
    }).as('getLoans');

    cy.intercept('POST', '**/orders', {
      statusCode: 401,
      body: { message: 'Sesija je istekla.' },
    }).as('createOrder');

    cy.visit('/client/securities', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'expired-token');
        win.localStorage.removeItem('refreshToken');
        win.localStorage.setItem('user', JSON.stringify(expiredSessionUser));
      },
    });

    cy.wait('@getListings');

    openOrderModal('EXPR');
    fillCommonOrderFields({ quantity: 1 });
    submitOrderAndConfirm();
    cy.contains('button', 'Potvrdi').click();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 401);
    cy.location('pathname', { timeout: 10000 }).should('eq', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
