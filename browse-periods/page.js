import { t, Selector } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors'

class PeriodRow {
  constructor (row) {
    this.label = row.find('span').nth(2)
    this.spatialCoverage = row.find('span').nth(5)
  }

  async click () {
    await t.click(this.label)
  }
}

class PeriodList {
  constructor (list) {
    this.periodsShown = list.find('label').nth(0)
    this.periodsFiltered = list.find('p').nth(0)
    this.firstRow = new PeriodRow(list.find('div.row').nth(1))
  }
}

class PlaceFilter {
  constructor (filter) {
    this.open = filter.find('span[role="button"]').nth(0)
    this.input = filter.find('input[type="text"]').nth(0)
  }
}

class Facet {
  constructor (facet) {
    this.values = facet.find('a')
    this.selectedValues = facet.find('table.selected a')
  }

  async selectValue (value) {
    await t.click(this.values.withText(value))
  }
}

class PeriodDetails {
  constructor () {
    this.originalLabel = ReactSelector('Field').withProps(
      { value: { id: 'Original label' }}
    ).find('dd')
  }
}

class BrowsePeriods {
  constructor () {
    this.breadcrumbs = ReactSelector('UI:Breadcrumb').findReact('li')

    this.labelFilterInput = Selector('#Search').find('input[type="text"]')

    this.timeSliderRail = ReactSelector('UI:TimeSlider')
      .findReact('Rail')

    this.placeFilter = new PlaceFilter(Selector('#PlaceFilter'))

    const summary = ReactSelector('UI:Summary')
    this.filterPeriodsSummary = summary.nth(0)
    this.periodCoverageSummary = summary.nth(1)
    this.periodListSummary = summary.nth(2)

    this.map = ReactSelector('UI:WorldMap')
      .find('div.mapCanvas')
      .child()

    this.periodList = new PeriodList(Selector('#PeriodList'))
    this.facets = {}
    for (const facet of [ 'authority', 'language', 'spatialCoverage' ]) {
      this.facets[facet] = new Facet(
        ReactSelector('AspectTable').withProps('aspectID', facet)
      )
    }
    this.periodDetails = new PeriodDetails()
  }

  async setLabelFilter (query) {
    await t.typeText(this.labelFilterInput, query)
  }

  async setWidestTimeFilter () {
    // click left edge of rail
    await t.click(this.timeSliderRail, { offsetX: 5 })
  }

  async setPlaceFilter (query) {
    await t
      .click(this.placeFilter.open)
      .typeText(this.placeFilter.input, query)
      .pressKey('down')
      .pressKey('enter')
  }
}

export default new BrowsePeriods()
