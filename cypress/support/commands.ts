/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare namespace Cypress {
    interface Chainable<Subject = any> {
        btncolorcheck(num: number): void;
    }
}

Cypress.Commands.add("btncolorcheck", (num) => {
    cy.get(`.overflow-x-scroll > :nth-child(${num})`)
        .click()
        .then(() => {
            // 클릭 후 대기 시간 추가 (필요시)
            // cy.wait(1000); // 1초 기다림

            // 버튼 클릭 후 색상 확인
            cy.get(`.overflow-x-scroll > :nth-child(${num})`).should("have.css", "color", "rgb(255, 255, 255)");
        });
});
