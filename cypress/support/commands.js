// cypress/support/commands.js

// Example of a custom command
Cypress.Commands.add('login', (username, password) => {
    cy.visit('/login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(password)
    cy.get('form').submit()
  })
  