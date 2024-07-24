describe("template spec", () => {
    it("passes", () => {
        cy.visit("/");
        cy.wait(1000);
        cy.get(`.overflow-x-scroll`)
            .children("button")
            .each((el, i) => {
                cy.btncolorcheck(i + 1);
            });

        // cy.wrap(Array.from({ length: 6 })).each((item, i) => {
        //     cy.btncolorcheck(i + 1);
        // });
    });
});
