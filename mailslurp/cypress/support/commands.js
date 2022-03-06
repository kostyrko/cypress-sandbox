const { MailSlurp } = require("mailslurp-client");
const mailslurp = new MailSlurp({ apiKey: Cypress.env("API_KEY") });

Cypress.Commands.add("waitForLatestEmail", (inboxId) => {
  return mailslurp.waitForLatestEmail(inboxId);
});

Cypress.Commands.add("createInbox", () => {
    // instantiate MailSlurp
    const mailslurp = new MailSlurp({ apiKey: Cypress.env("API_KEY") });
    // return { id, emailAddress } or a new randomly generated inbox
    return mailslurp.createInbox();
});