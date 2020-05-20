import { t } from 'testcafe'
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
    this.periodsShown = list.findReact('label')
    this.periodsFiltered = list.findReact('p')
    this.firstRow = new PeriodRow(list.findReact('ItemRow'))
  }
}

class PlaceFilter {
  constructor (filter) {
    this.open = filter.find('a')
    this.input = filter.findReact('UI:PlaceSuggest').find('input[type="text"]')
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

    this.labelFilterInput = ReactSelector('LayoutBlock')
      .withProps('id', 'Search')
      .find('input[type="text"]')

    this.timeSliderRail = ReactSelector('UI:TimeSlider')
      .findReact('Rail')

    this.placeFilter = new PlaceFilter(
      ReactSelector('LayoutBlock').withProps('id', 'PlaceFilter')
    )

    const summary = ReactSelector('UI:Summary', { timeout: 12000 })
    this.filterPeriodsSummary = summary.nth(0)
    this.periodCoverageSummary = summary.nth(1)
    this.periodListSummary = summary.nth(2)

    this.map = ReactSelector('UI:WorldMap')
      .find('div.mapCanvas')
      .child()

    this.periodList = new PeriodList(
      ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
    )
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
