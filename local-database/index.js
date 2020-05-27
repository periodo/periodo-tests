import { waitForReact } from 'testcafe-react-selectors'
import page from './page'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , rando = `test-${ Math.random().toString(36).substr(2, 5) }`

fixture('Work with a local database')
  .page(`${ host }/?page=open-backend`)
  .beforeEach(async () => {
    await waitForReact()
    await page.addDataSource(rando)
  })

test('Add a local database', async t => {
  await t
    .expect(page.getURL())
    .contains(`${ host }/?page=backend-home&backendID=local-`)
})
  .after( async () => {
    await page.deleteDataSource(rando)
  })

test('Delete local database', async t => {
  await t
    .click(page.menu.dataSourcesLink)
    .click(page.findDataSource(rando).editLink)
    .expect(page.getURL())
    .contains(`${ host }/?page=backend-edit&backendID=local-`)
    .setNativeDialogHandler(() => true)
    .click(page.backendForm.deleteButton)
    .expect(page.findDataSource(rando).viewLink.exists)
    .notOk()
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
    .eql(rando)
    .expect(page.breadcrumbs.nth(1).textContent)
    .contains('Emma Goldman. Emma Goldman : a documentary history of the')
})
  .after( async () => {
    await page.deleteDataSource(rando)
  })

test('Import changes', async t => {
  await t
    .click(page.menu.importChangesLink)
    .expect(page.getURL())
    .contains(`${ host }/?page=backend-sync&backendID=local-`)
    .click(page.dataSourceSelect.button)
    .click(page.dataSourceSelect.currentHost)
    .expect(page.changeSummary.textContent)
    .contains('Added authority (')
    .click(page.selectAll)
    .click(page.continueButton)
    .click(page.continueButton) // accept changes
    .expect(page.getURL())
    .contains(`${ host }/?page=backend-home&backendID=local-`)
    .expect(page.breadcrumbs.nth(0).textContent)
    .eql(rando)
})
  .after( async () => {
    await page.deleteDataSource(rando)
  })
