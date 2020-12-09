import { Selector } from 'testcafe'
import { waitForReact } from 'testcafe-react-selectors'
import page from './page'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , dataHost = process.env.DATA_HOST || (
      host.includes('client')
        ? host.replace('client', 'data')
        : 'https://data.staging.perio.do'
    )
    , backendID = encodeURIComponent(`web-${ dataHost }/`)


fixture('Authentication and authorization')
  .page(`${ host }/?page=backend-edit&backendID=${ backendID }`)
  .beforeEach(async () => { await waitForReact() })

const ORCID = {
  usernameInput: Selector('input#username'),
  passwordInput: Selector('input#password'),
  signInButton: Selector('button#signin-button'),
}

test('Login via ORCID', async t => {
  if (! (process.env.ORCID_USER && process.env.ORCID_PASSWORD)) {
    console.error('No ORCID_USER or ORCID_PASSWORD, skipping test')
    return
  }

  if (t.browser.alias.startsWith('safari')) {
    console.error('Currently broken on Safari, skipping test')
  } else {

    console.error(process.env.ORCID_USER)

    await t
      .click(page.loginLink)
      .typeText(ORCID.usernameInput, process.env.ORCID_USER)
      .typeText(ORCID.passwordInput, process.env.ORCID_PASSWORD)
      .click(ORCID.signInButton)

    await t
      .expect(page.alert.textContent)
      .eql('Successfully authenticated')
  }
})
