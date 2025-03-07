describe("SignIn page", () => {
  before(() => {
    cy.log(`Visiting /signIn`);
    cy.visit("/signIn");
  });
  it("SignIn win MetaMask", () => {
    const username = Cypress.env("METAMASK_USER_ID");
    const loginUrl = Cypress.env("SITE_NAME");
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: true,
      logs: false,
      isPopup: true,
      loginSelector: `a[href="${Cypress.env(
        "SITE_NAME",
      )}/api/auth/signin/google"]`,
      postLoginSelector: ".unread-count",
    };

    return cy
      .task("GoogleSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies();

        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });

          Cypress.Cookies.defaults({
            preserve: cookieName,
          });

          // remove the two lines below if you need to stay logged in
          // for your remaining tests
          cy.visit("/api/auth/signout");
          cy.get("form").submit();
        }
      });
  });
});
