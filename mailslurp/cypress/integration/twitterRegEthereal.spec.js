/// <reference types="cypress" />
// https://github.com/bahmutov/cypress-recurse
const { recurse } = require('cypress-recurse')

describe('Email confirmation', () => {
    let userEmail

    before(() => {
        // get and check the test email only once before the tests
        cy.task('getUserEmail').then((email) => {
            cy.log(email)
            console.log(email)
            // expect(email).to.be.a('string')
            userEmail = email
        })
    })

    it('Registers a user on Twitter', () => {
        cy.visit('https://twitter.com/i/flow/signup');
        cy.contains('Join Twitter today');
        cy.contains('Sign up with phone or email').click()
        cy.contains('Create your account');
        cy.contains('Use email instead').click()
        cy.get('[name="name"]').type('Mike')
        cy.get('[name="email"]').type(userEmail)
        cy.get('#SELECTOR_1').select('January')
        cy.get('#SELECTOR_2').select('1')
        cy.get('#SELECTOR_3').select('1990')
        cy.contains('Next').click()
        cy.contains('Next').click()
        cy.contains('Sign up').click()

        // cy.wait(5000)
        recurse(
            () => cy.task('getLastEmail'), // Cypress commands to retry
            Cypress._.isObject, // keep retrying until the task returns an object
            {
              timeout: 60000, // retry up to 1 minute
              delay: 5000, // wait 5 seconds between attempts
            },
          )
        .its('text')
        .then((text) => {
            // expect 6 digit verification code from Twitter
            cy.log(text.match(/\b\d{6}\b/g))
            cy.get('[name="verfication_code"]').type(text.match(/\b\d{6}\b/g)[0])
            cy.contains('Next').click()
            cy.contains("You'll need a password").should('exist')
            cy.contains('[type="password"]').type('Test123!')
            cy.contains('Next').click()
            cy.contains('Please verify your account').should('exist')
        })
    })
})

