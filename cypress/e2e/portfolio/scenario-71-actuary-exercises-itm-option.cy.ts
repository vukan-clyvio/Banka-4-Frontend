import {
    actuaryUser,
    loginAs,
    interceptActuaryPortfolio,
    msftOptionITM,
    msftStock,
} from './helpers';

/**
 * Scenario 71 – Aktuar može da iskoristi opciju koja je in-the-money
 *
 * Given  aktuar poseduje put opciju
 * And    settlement date nije prošao
 * And    opcija je in-the-money (status === 'ITM')
 * When   klikne na "Iskoristi opciju" (EXERCISE button)
 * Then   sistem dozvoljava akciju (window.confirm prikazuje dijalog)
 * And    opcija se izvršava (alert potvrde)
 *
 * Implementation note: OptionsSection uses window.confirm + window.alert.
 * We stub both before visiting so Cypress can intercept them.
 */
describe('Scenario 71: Aktuar može da iskoristi opciju koja je in-the-money', () => {
    beforeEach(() => {
        // Portfolio returns both a stock and an ITM option
        interceptActuaryPortfolio([msftStock, msftOptionITM]);
    });

    it('prikazuje dugme EXERCISE za ITM opciju čiji rok nije istekao', () => {
        loginAs(actuaryUser, '/portfolio');
        cy.wait('@getPortfolio');

        cy.contains('button', 'EXERCISE').should('be.visible');
    });

    it('klik na EXERCISE otvara confirm dijalog', () => {
        cy.visit('/portfolio', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'test-token');
                win.localStorage.setItem('refreshToken', 'test-refresh-token');
                win.localStorage.setItem('user', JSON.stringify(actuaryUser));
                // Stub window.confirm to auto-accept and record the call
                cy.stub(win, 'confirm').as('confirmStub').returns(true);
                cy.stub(win, 'alert').as('alertStub');
            },
        });

        cy.wait('@getPortfolio');

        cy.contains('button', 'EXERCISE').click({ force: true });

        // Confirm dialog must be triggered with the ticker name
        cy.get('@confirmStub').should('have.been.calledWithMatch', /MSFT-PUT/i);
    });

    it('nakon potvrde prikazuje se alert o uspešnom izvršenju opcije', () => {
        cy.visit('/portfolio', {
            onBeforeLoad(win) {
                win.localStorage.setItem('token', 'test-token');
                win.localStorage.setItem('refreshToken', 'test-refresh-token');
                win.localStorage.setItem('user', JSON.stringify(actuaryUser));
                cy.stub(win, 'confirm').returns(true);
                cy.stub(win, 'alert').as('alertStub');
            },
        });

        cy.wait('@getPortfolio');
        cy.contains('button', 'EXERCISE').click({ force: true });

        // Alert must be triggered to confirm the exercise
        cy.get('@alertStub').should('have.been.calledWithMatch', /MSFT-PUT/i);
    });

    it('EXERCISE dugme nije prikazano za opcije sa prošlim settlement datumom', () => {
        const expiredOption = { ...msftOptionITM, settlement: '2020-01-01' };
        cy.intercept('GET', /\/actuary\/[^/]+\/assets/, {
            statusCode: 200,
            body: { assets: [msftStock, expiredOption], tax: { taxPaid: 0, taxUnpaid: 0 } },
        }).as('getPortfolioExpired');

        loginAs(actuaryUser, '/portfolio');
        cy.wait('@getPortfolioExpired');

        cy.contains('button', 'EXERCISE').should('not.exist');
    });
});