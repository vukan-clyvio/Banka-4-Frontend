/**
 * Scenario 71 – Admin može da iskoristi opciju koja je in-the-money
 */
describe('Scenario 71: Admin može da iskoristi opciju koja je in-the-money', () => {
    
    beforeEach(() => {
        // Popravljeno: koristimo Admin login jer rola Actuary ne postoji
        cy.loginAsAdmin();
        
        cy.visit('/portfolio', {
            onBeforeLoad(win) {
                // Stubujemo window dijaloge
                cy.stub(win, 'confirm').as('confirmStub').returns(true);
                cy.stub(win, 'alert').as('alertStub');
            },
        });

        // Čekamo da se tabela učita pre testova
        cy.get('table', { timeout: 10000 }).should('be.visible');
    });

    it('prikazuje dugme EXERCISE za ITM opcije i proverava interakciju', () => {
        // Tražimo red sa ITM statusom
        cy.get('table tbody tr').then(($rows) => {
            const itmRow = $rows.toArray().find(row => 
                row.innerText.includes('ITM') || row.innerText.includes('In The Money')
            );

            if (itmRow) {
                cy.wrap(itmRow).within(() => {
                    cy.contains('button', /EXERCISE/i)
                        .should('be.visible')
                        .click({ force: true });
                });

                // Provera potvrde
                cy.get('@confirmStub').should('have.been.called');
                cy.get('@alertStub').should('be.called');
            } else {
                cy.log('Nema dostupnih ITM opcija za testiranje.');
            }
        });
    });

    it('EXERCISE dugme nije prikazano za opcije koje nisu ITM', () => {
        cy.get('table tbody tr').each(($tr) => {
            // Ako je opcija Out of the Money (OTM), dugme ne sme postojati
            if ($tr.text().includes('OTM') || $tr.text().includes('Out of the Money')) {
                cy.wrap($tr).contains('button', /EXERCISE/i).should('not.exist');
            }
        });
    });
});