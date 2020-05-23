import { Selector, ClientFunction } from 'testcafe'

class Page {
  constructor () {
    this.loginLink = Selector('a').withText('Log in with your ORCID')
    this.getURL = ClientFunction(() => window.location.href)
    this.getCapturedErrorMessage = ClientFunction(() => window.capturedErrorMessage)
  }
}

export default new Page()
