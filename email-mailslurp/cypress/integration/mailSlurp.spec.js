/// <reference types="cypress" />

describe("Sign up using mailslurp", () => {

  after(() => {
    cy.get("[data-cy='confirmed-code']").should('contain', 'Valid confirmation code');
  })
  it("can generate a new email address and sign up", () => {
    cy.visit("localhost:3000"); 
    let inboxId;
    let emailAddress;
    const userName = 'Joe Bravo'
    cy.createInbox().then((inbox) => {
      // verify a new inbox was created
      assert.isDefined(inbox);
      // save the inboxId for later checking the emails
      inboxId = inbox.id;
      emailAddress = inbox.emailAddress;


      cy.get("#name").type(userName);
      cy.get("#email").type(emailAddress);
      cy.get("#company_size").select("3");
      cy.get("button[type=submit]").click();

      // wait for an email in the inbox
      cy.waitForLatestEmail(inboxId).then((email) => {
        // verify we received an email
        assert.isDefined(email)
        cy.document({ log: false }).invoke({ log: false }, 'write', email.body)

        cy.contains('[data-cy=user-name]', userName).should('be.visible')

        cy.get('[data-cy=confirmation-code]')
        .should('be.visible')
        .invoke('text')
        .then((code) => {
            cy.log(`**confirm code ${code} works**`)
            expect(code, 'confirmation code')
            .to.be.a('string')
            .and.have.length.gt(5)
            cy.contains('Confirm registration').click()
            cy.get('#confirmation_code', { timeout: 10000 }).type(code)
            cy.get('button[type=submit]').click()

            cy.get('[data-cy=confirmed-code]').should('be.visible')
        })
      });
    });
  });
});
