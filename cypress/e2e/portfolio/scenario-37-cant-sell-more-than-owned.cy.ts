/**
 * Scenario 37 – Korisnik ne može prodati više hartija nego što poseduje
 *
 * Given  korisnik ima određenu količinu hartija u portfoliju (sa backenda)
 * When   pokuša da unese veću količinu od posedovane
 * Then   sistem prikazuje validacionu grešku
 * And    dugme "Nastavi" ostaje onemogućeno
 */
describe('Scenario 37: Korisnik ne može prodati više hartija nego što poseduje', () => {
    
    beforeEach(() => {
        cy.loginAsClient();
        cy.visit('/client/portfolio');
    });

    it('validacija količine: prikazuje grešku i onemogućava nastavak', () => {
        cy.get('table').should('be.visible');

        cy.get('table tbody tr').first().then(($row) => {
            // Uzimamo vrednost iz 3. kolone (indeks 2)
            const ownedAmountText = $row.find('td').eq(2).text().trim();
            const ownedAmount = parseFloat(ownedAmountText);
            const tooMuch = ownedAmount + 1;

            cy.wrap($row).find('button').contains('SELL').click({ force: true });

            // POPRAVKA: Tražimo input koji je tipa 'number' ili ima specifičan atribut
            // Ako ovo ne upali, probaj: cy.get('input[type="number"]')
            cy.get('input').filter('[type="number"], [name*="quantity"], [placeholder*="količina"]')
                .filter(':visible')
                .first()
                .as('quantityInput');

            cy.get('@quantityInput')
                .should('be.visible')
                .clear() // Sada će čistiti pravo polje
                .type(tooMuch.toString());

            // Provera poruke o grešci
            cy.contains(/nemate dovoljno|posedujete|iznos premašuje/i, { timeout: 6000 })
                .should('be.visible');

            // Dugme Nastavi mora biti disabled
            cy.contains('button', /Nastavi/i).should('be.disabled');
        });
    });

    it('forma ne prelazi na potvrdu čak i uz forsirani klik', () => {
        cy.get('table').should('be.visible');
        cy.contains('button', 'SELL').first().click({ force: true });

        // Koristimo isti precizniji selektor
        cy.get('input[type="number"]').filter(':visible').first().clear().type('9999999');

        cy.contains('button', /Nastavi/i).click({ force: true });

        cy.contains(/Potvrda/i).should('not.exist');
    });
});