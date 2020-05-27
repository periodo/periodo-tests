import { waitForReact } from 'testcafe-react-selectors'
import page from './page'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , rando = Math.random().toString(36).substr(2, 5)
    , testSource = `test-${ rando }`
    , stagingSource = `staging-${ rando }`

fixture('Work with a local database')
  .page(`${ host }/?page=open-backend`)
  .beforeEach(async t => {
    await waitForReact()
    await page.addWebDataSource(stagingSource, 'https://data.staging.perio.do')
    await t.click(page.menu.dataSourcesLink)
    await page.addLocalDataSource(testSource)
  })
  .afterEach(async () => {
    await page.deleteDataSource(testSource)
    await page.deleteDataSource(stagingSource)
  })

test('Add a local database', async t => {
  await t
    .expect(page.getURL())
    .contains(`${ host }/?page=backend-home&backendID=local-`)
})

test('Add an authority to local database', async t => {
  await t
    .click(page.menu.addAuthorityLink)
    .expect(page.getURL())
    .contains(`${ host }/?page=backend-add-authority&backendID=local-`)
    .typeText(
      page.authorityForm.ldInput,
      'http://www.worldcat.org/oclc/881466843'
    )
    .click(page.authorityForm.ldButton)
    .click(page.authorityForm.saveButton)
    .expect(page.getURL())
    .contains(`${ host }/?page=authority-view&backendID=local-`)
    .expect(page.breadcrumbs.nth(0).textContent)
    .eql(testSource)
    .expect(page.breadcrumbs.nth(1).textContent)
    .contains('Emma Goldman. Emma Goldman : a documentary history of the')
})

test('Import changes', async t => {
  // TODO: get this test passing on safari
  if (! t.browser.alias.startsWith('safari')) {
    await t
      .click(page.menu.importChangesLink)
      .expect(page.getURL())
      .contains(`${ host }/?page=backend-sync&backendID=local-`)
      .click(page.dataSourceSelect.button)
      .click(page.dataSourceSelect.option.withExactText(stagingSource))
      .expect(page.changeSummary.textContent)
      .contains('Added authority (')
      .click(page.selectAll)
      .click(page.continueButton)
      .click(page.continueButton) // accept changes
      .expect(page.getURL())
      .contains(`${ host }/?page=backend-home&backendID=local-`)
      .expect(page.breadcrumbs.nth(0).textContent)
      .eql(testSource)
  } else {
    console.error('Currently broken on Safari, skipping test')
  }
})
