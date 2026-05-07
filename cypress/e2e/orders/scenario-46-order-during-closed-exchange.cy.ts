import {
  setupClientPage, openOrderModal,
  selectAccount, setQuantity,
  proceedAndConfirm, usdClientAccount,
} from './helpers';

// Berza je zatvorena, korisnik ipak kreira order — sistem prihvata uz after_hours flag
describe('Scenario 46: Order kreiran dok je berza zatvorena — sporije izvršavanje', () => {
  beforeEach(() => {
    setupClientPage([usdClientAccount]);
  });

  it('order je kreiran i prikazuje se poruka o usporenom/odloženom izvršavanju', () => {
    cy.intercept('POST', '**/orders', {
      statusCode: 201,
      body: {
        order_id:    1006,
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

    // Order je kreiran
    cy.contains(/order je kreiran/i).should('be.visible');
    // Prikazuje se poruka o odloženom/usporenom izvršavanju
    cy.contains(/kada berza otvori|tržište.*zatvoreno|ažurirani.*berza otvori/i).should('be.visible');
  });
});
