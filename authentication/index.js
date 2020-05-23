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
  emailInput: Selector('input#userId'),
  passwordInput: Selector('input#password'),
  signInButton: Selector('button#form-sign-in-button'),
}

const errorHandler = () => {
  window.addEventListener('error', e => {
    if (e.message && e.message.includes(
      "Error: Cannot call method 'postMessage' of null")
    ) {
      e.stopImmediatePropagation()
      window.capturedErrorMessage = e.message
    }
  })
}

test('Login via ORCID', async t => {
  if (! (process.env.ORCID_USER && process.env.ORCID_PASSWORD)) {
    console.error('No ORCID_USER or ORCID_PASSWORD, skipping test')
    return
  }

  await t
    .click(page.loginLink)
    .typeText(ORCID.emailInput, process.env.ORCID_USER)
    .typeText(ORCID.passwordInput, process.env.ORCID_PASSWORD)
    .click(ORCID.signInButton)

  await t
    .expect(page.getURL())
    .contains(`${ dataHost }/registered?origin=${ encodeURIComponent(host) }&`)

  // postMessage won't work with the testcafe proxy, so we can't get past here

  if (t.browser.alias.startsWith('firefox')) {
    // On Firefox `opener.postMessage` just silently fails
  } else {
    // On WebKit `opener` is null due to x-domain restrictions
    await t
     .expect(page.getCapturedErrorMessage())
     .contains("Error: Cannot call method 'postMessage' of null")
  }
})
.clientScripts({ content: `(${ errorHandler.toString() })()` })
