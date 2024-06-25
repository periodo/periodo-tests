import { Selector } from "testcafe";
import { waitForReact } from "testcafe-react-selectors";
import page from "./page";

const host = process.env.HOST || "https://client.staging.perio.do",
  dataHost =
    process.env.DATA_HOST ||
    (host.includes("client")
      ? host.replace("client", "data")
      : "https://data.staging.perio.do"),
  backendID = encodeURIComponent(`web-${dataHost}/`),
  fixture_name = "Authentication and authorization";

console.log(fixture_name);
console.log(`  Client hosted at ${host}`);
console.log(`  Server hosted at ${dataHost}`);
console.log();

fixture(fixture_name)
  .page(`${host}/?page=backend-edit&backendID=${backendID}`)
  .beforeEach(async () => {
    await waitForReact();
  });

const ORCID = {
  cookieConsentPopupCloseButton: Selector(
    "div#onetrust-close-btn-container",
  ).child(0),
  usernameInput: Selector("input#username-input"),
  passwordInput: Selector("input#password"),
  signInButton: Selector("button#signin-button"),
};

test("Login via ORCID", async (t) => {
  if (!(process.env.ORCID_USER && process.env.ORCID_PASSWORD)) {
    console.error(
      "No ORCID_USER or ORCID_PASSWORD; skipping authentication tests",
    );
    return;
  }

  // wait for the ORCID login page to finish loading
  await t.click(page.loginLink).wait(3000);

  if (await ORCID.cookieConsentPopupCloseButton.exists) {
    await t.click(ORCID.cookieConsentPopupCloseButton);
  }

  await t
    .typeText(ORCID.usernameInput, process.env.ORCID_USER)
    .typeText(ORCID.passwordInput, process.env.ORCID_PASSWORD)
    .click(ORCID.signInButton);

  await t.expect(page.alert.textContent).eql("Successfully authenticated");
});
