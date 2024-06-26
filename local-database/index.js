import { waitForReact } from "testcafe-react-selectors";
import page from "./page";

const host = process.env.HOST || "https://client.staging.perio.do",
  rando = Math.random().toString(36).substr(2, 5),
  testSource = `test-${rando}`,
  stagingSource = `staging-${rando}`,
  fixture_name = "Work with a local database";

console.log(fixture_name);
console.log(`  Client hosted at ${host}`);
console.log("  Server hosted at https://data.staging.perio.do/");
console.log();

fixture(fixture_name)
  .page(`${host}/?page=open-backend`)
  .beforeEach(async (t) => {
    await waitForReact();
    await page.addWebDataSource(stagingSource, "https://data.staging.perio.do");
    await t.click(page.menu.dataSourcesLink);
    await page.addLocalDataSource(testSource);
  })
  .afterEach(async (t) => {
    await page.deleteDataSource(testSource);
    await page.deleteDataSource(stagingSource);
  });

test("Add a local database", async (t) => {
  await t
    .expect(page.getURL())
    .contains(`${host}/?page=backend-home&backendID=local-`);
});

test("Add an authority to local database", async (t) => {
  await t
    .click(page.menu.addAuthorityLink)
    .expect(page.getURL())
    .contains(`${host}/?page=backend-add-authority&backendID=local-`);

  await page.addAuthority("http://www.worldcat.org/oclc/881466843");

  await t
    .expect(page.getURL())
    .contains(`${host}/?page=authority-view&backendID=local-`)
    .expect(page.breadcrumbs.nth(0).textContent)
    .eql(testSource)
    .expect(page.breadcrumbs.nth(1).textContent)
    .contains("Emma Goldman. Emma Goldman : a documentary history of the");
});

test("Add an authority and push changes", async (t) => {
  await t
    .click(page.menu.addAuthorityLink)
    .expect(page.getURL())
    .contains(`${host}/?page=backend-add-authority&backendID=local-`);

  await page.addAuthority("http://www.worldcat.org/oclc/881466843");

  await t
    .click(page.menu.submitChangesLink)
    .expect(page.getURL())
    .contains(`${host}/?page=backend-submit-patch&backendID=local-`)
    .click(page.dataSourceSelect.button)
    .click(page.dataSourceSelect.option.withExactText(stagingSource))
    .expect(page.changeSummary.textContent)
    .contains("Added authority (1)");
});

test("Add an authority and pull changes", async (t) => {
  await t
    .click(page.menu.addAuthorityLink)
    .expect(page.getURL())
    .contains(`${host}/?page=backend-add-authority&backendID=local-`);

  await page.addAuthority("http://www.worldcat.org/oclc/881466843");

  await t
    .click(page.menu.importChangesLink)
    .expect(page.getURL())
    .contains(`${host}/?page=backend-sync&backendID=local-`)
    .click(page.dataSourceSelect.button)
    .click(page.dataSourceSelect.option.withExactText(stagingSource))
    .expect(page.changeSummary.textContent)
    .contains("Added authority (")
    .expect(page.changeSummary.textContent)
    .notContains("Removed authority (")
    .click(page.selectAll)
    .click(page.continueButton)
    .click(page.continueButton) // accept changes
    .expect(page.getURL())
    .contains(`${host}/?page=backend-home&backendID=local-`)
    .expect(page.breadcrumbs.nth(0).textContent)
    .eql(testSource);
});
