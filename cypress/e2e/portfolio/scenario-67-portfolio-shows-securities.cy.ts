/**
 * Scenario 67 – Portfolio prikazuje listu posedovanih hartija
 * 
 * NAPOMENA: Test koristi realne podatke sa backend-a. 
 * Korisnik mora imati barem jednu hartiju u portfoliju da bi test prošao.
 */
describe('Scenario 67: Portfolio prikazuje listu posedovanih hartija (Real Data)', () => {
    
    beforeEach(() => {
        // Koristimo tvoju komandu za login koja postavlja prave tokene/sesiju
        cy.loginAsClient();
        cy.visit('/client/portfolio');
    });

    it('prikazuje naslov i strukturu tabele', () => {
        cy.contains('h1', /Moj Portfolio/i).should('be.visible');
        
        // Čekamo da tabela prestane da bude prazna ili da nestane loading indikator
        // Pretpostavljamo da tabela ima tbody koji će dobiti redove sa backenda
        cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
    });

    it('verifikuje zaglavlja kolona', () => {
        const expectedHeaders = [
            'TICKER', 
            'TYPE', 
            'AMOUNT', 
            'PRICE', 
            'PROFIT', 
            'LAST MODIFIED'
        ];

        expectedHeaders.forEach(header => {
            cy.get('th').contains(new RegExp(header, 'i')).should('be.visible');
        });
    });

    it('proverava ispravnost podataka u prvom redu tabele', () => {
        cy.get('table tbody tr').first().within(() => {
            // Ticker (obično prva kolona, ne sme biti prazan i treba da je uppercase)
            cy.get('td').eq(0).invoke('text').should('not.be.empty');
            
            // Tip hartije (očekujemo STOCK, OPTION, FUTURE itd.)
            cy.get('td').eq(1).should('not.be.empty');
            
            // Amount (mora biti broj veći od 0)
            cy.get('td').eq(2).then(($td) => {
                const amount = parseFloat($td.text());
                expect(amount).to.be.greaterThan(0);
            });

            // Cena i Profit (provera da su polja popunjena)
            cy.get('td').eq(3).should('not.be.empty');
            cy.get('td').eq(4).should('not.be.empty');

            // Last Modified (provera formata datuma ili da nije prazno)
            cy.get('td').eq(5).should('not.be.empty');

            // Prodaja mora biti dostupna
            cy.contains('button', /SELL/i).should('be.visible');
        });
    });

    it('omogućava interakciju sa hartijom', () => {
        // Klik na prvi ticker u tabeli
        cy.get('table tbody tr').first().find('td').eq(0).click();
        
        // Ovde možeš dodati proveru da li se otvorio modal ili nova stranica
        // npr. cy.get('.modal-content').should('be.visible');
    });
});