import {
  setupClientPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, usdClientAccount,
} from './helpers';

// After-hours stanje: manje od 4h od zatvaranja berze
// Order može biti kreiran ali korisnik vidi info o sporijoj obradi
describe('Scenario 47: Upozorenje kada je berza u after-hours periodu', () => {
  beforeEach(() => {
    setupClientPage([usdClientAccount]);
  });

  it('order je kreiran i prikazuje se after-hours poruka o sporijem izvršavanju', () => {
    cy.intercept('POST', '**/orders', {
      statusCode: 201,
      body: {
        order_id:    1007,
        status:      'PENDING',
        after_hours: true,
      },
    }).as('createOrder');

    openOrderModal('Kupi');
    cy.wait('@getAccounts');
    selectAccount(usdClientAccount.account_number);
    setQuantity(2);
    proceedAndConfirm();

    cy.wait('@createOrder').its('response.statusCode').should('eq', 201);

    // Order je kreiran — korisnik vidi after-hours napomenu
    cy.contains(/order je kreiran/i).should('be.visible');
    cy.contains(/berza otvori|after.hours|tržište.*zatvoreno/i).should('be.visible');
  });
});
