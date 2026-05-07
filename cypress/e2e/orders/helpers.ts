import { agentUser, clientUser, loginAs } from '../../support/helpers';

// Stock priced at $25 — quantity 4 gives total $100
export const testStock = {
  listing_id: 1,
  ticker: 'MSFT',
  name: 'Microsoft Corporation',
  exchange: 'NASDAQ',
  price: 25,
  change: 0.5,
  change_percent: 2.0,
  volume: 10_000_000,
  bid: 24.9,
  ask: 25.1,
  maintenance_margin: 0,
  initial_margin_cost: 0,
  currency: 'USD',
};

export const usdBankAccount = {
  AccountNumber: '840-111-001',
  account_number: '840-111-001',
  Name: 'Interni USD račun',
  name: 'Interni USD račun',
  Balance: 50_000,
  balance: 50_000,
  Currency: { Code: 'USD' },
  currency: 'USD',
  AccountType: 'bank',
  account_type: 'bank',
  CompanyID: 1,
  company_id: 1,
};

export const eurBankAccount = {
  AccountNumber: '978-111-002',
  account_number: '978-111-002',
  Name: 'Interni EUR račun',
  name: 'Interni EUR račun',
  Balance: 50_000,
  balance: 50_000,
  Currency: { Code: 'EUR' },
  currency: 'EUR',
  AccountType: 'bank',
  account_type: 'bank',
  CompanyID: 1,
  company_id: 1,
};

export const usdClientAccount = {
  account_number: '840-200-001',
  name: 'USD račun',
  balance: 500,
  currency: 'USD',
};

export const eurClientAccount = {
  account_number: '978-200-002',
  name: 'EUR račun',
  balance: 10_000,
  currency: 'EUR',
};

export const emptyClientAccount = {
  account_number: '840-200-003',
  name: 'Prazan račun',
  balance: 0,
  currency: 'USD',
};

export function setupActuaryPage(accounts = [usdBankAccount]) {
  cy.intercept('GET', '**/listings/stocks*', {
    statusCode: 200,
    body: { data: [testStock] },
  }).as('getStocks');

  cy.intercept('GET', '**/listings/stocks/1*', {
    statusCode: 200,
    body: testStock,
  }).as('getStockDetails');

  cy.intercept('GET', '**/api/accounts*', {
    statusCode: 200,
    body: { data: accounts },
  }).as('getBankAccounts');

  loginAs(agentUser, '/securities');
  cy.wait('@getStocks');
}

export function setupClientPage(accounts = [usdClientAccount]) {
  cy.intercept('GET', '**/listings/stocks*', {
    statusCode: 200,
    body: { data: [testStock] },
  }).as('getStocks');

  cy.intercept('GET', '**/listings/stocks/1*', {
    statusCode: 200,
    body: testStock,
  }).as('getStockDetails');

  cy.intercept('GET', '**/clients/*/accounts*', {
    statusCode: 200,
    body: { data: accounts },
  }).as('getAccounts');

  cy.intercept('GET', '**/clients/*/loans*', {
    statusCode: 200,
    body: [],
  }).as('getLoans');

  loginAs(clientUser, '/client/securities');
  cy.wait('@getStocks');
}

export function openOrderModal(label: 'Kupi' | 'Kreiraj nalog') {
  cy.contains('MSFT').click();
  cy.wait('@getStockDetails');
  cy.contains('button', label).click();
}

export function selectAccount(accountNumber: string) {
  cy.contains('label', 'Račun za kupovinu').parent().find('select').select(accountNumber);
}

export function setQuantity(qty: number) {
  cy.get('input[placeholder="Unesite količinu..."]').clear().type(String(qty));
}

export function setOrderType(type: 'Market' | 'Limit' | 'Stop' | 'Stop Limit') {
  cy.contains('label', 'Tip ordera').parent().find('select').select(type);
}

export function setLimitValue(val: number) {
  cy.get('input[placeholder="Unesite limit cenu..."]').clear().type(String(val));
}

export function proceedAndConfirm() {
  cy.contains('button', 'Nastavi').scrollIntoView().click({ force: true });
  cy.contains('h4', 'Potvrda ordera').should('be.visible');
  cy.contains('button', 'Potvrdi').click();
}
