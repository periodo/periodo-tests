import { t, Selector, ClientFunction } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors'

class Menu {
  constructor (menu) {
    this.dataSourcesLink = menu.find('a').withExactText('Data sources')
    this.addAuthorityLink = menu.find('a').withExactText('Add authority')
    this.importChangesLink = menu.find('a').withExactText('Import changes')
  }
}

class DataSource {
  constructor (viewLink) {
    this.viewLink = viewLink
    this.editLink = viewLink.parent(0).find('a').withExactText('edit')
  }
}

class BackendForm {
  constructor (form) {
    this.dataSourceTypeSelect = form.find('select')
    this.dataSourceTypeOption = this.dataSourceTypeSelect.find('option')
    this.dataSourceLabelInput = form.find('input[name="label"]').nth(0)
    this.dataSourceURLInput = form.find('input[name="url"]').nth(0)
    this.addButton = form.find('button').withExactText('Add')
    this.deleteButton = form.find('button').withExactText('Delete')
  }
}

class AuthorityForm {
  constructor (form) {
    const ldInput =  form.findReact('LDInput')
    this.ldInput = ldInput.find('textarea')
    this.ldButton = ldInput.find('button')
    this.saveButton = form.find('button').withExactText('Save')
  }
}

class Select {
  constructor (select) {
    this.button = select
    this.option =  select.find('h4')
  }
}

class Page {
  constructor () {
    this.breadcrumbs = ReactSelector('UI:Breadcrumb').find('li')
    this.backendForm = new BackendForm(ReactSelector('BackendForm'))
    this.authorityForm = new AuthorityForm(ReactSelector('AuthorityForm'))
    this.menu = new Menu(ReactSelector('UI:NavigationMenu'))
    this.dataSourceSelect = new Select(ReactSelector('BackendSelector'))
    this.changeSummary = Selector('div.section').find('li').nth(0)
    this.selectAll = ReactSelector('ToggleSelectAll')
    this.continueButton = ReactSelector('UI:Button')
      .withProps('variant', 'primary')
    this.getURL = ClientFunction(() => window.location.href)
  }

  findDataSource (name) {
    return new DataSource(Selector('a').withExactText(name).parent(0))
  }

  async addLocalDataSource(name) {
    await t
      .typeText(this.backendForm.dataSourceLabelInput, name)
      .click(this.backendForm.addButton)
  }

  async addWebDataSource(name, url) {
    await t
      .click(this.backendForm.dataSourceTypeSelect)
      .click(this.backendForm.dataSourceTypeOption.withText('Web (read-only)'))
      .typeText(this.backendForm.dataSourceLabelInput, name)
      .typeText(this.backendForm.dataSourceURLInput, url)
      .click(this.backendForm.addButton)
  }

  async deleteDataSource(name) {
    const dataSource = this.findDataSource(name)
    await t
      .click(this.menu.dataSourcesLink)
      .click(dataSource.editLink)
      .setNativeDialogHandler(() => true)
      .click(this.backendForm.deleteButton)
  }
}

export default new Page()
