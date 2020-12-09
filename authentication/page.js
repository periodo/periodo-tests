import { Selector } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors'

class Page {
  constructor () {
    this.loginLink = Selector('a').withText('Log in with your ORCID')
    this.alert = ReactSelector('UI:Alert')
  }
}

export default new Page()
