describe('Scenario 56: Filtriranje ordera po statusu Pending', () => {
    it('kada supervizor izabere filter Pending, prikazuju se samo Pending orderi', () => {
        cy.loginAsAdmin();

        // idi na Orders iz navbara
        cy.visit('http://localhost:5173/supervisor/orders');

    });
});