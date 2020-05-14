import { t } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors'

class PeriodRow {
  constructor (row) {
    this.label = row.find('span').nth(2)
    this.spatialCoverage = row.find('span').nth(5)
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

class BrowsePeriods {
  constructor () {
    this.firstBreadcrumb = ReactSelector('UI:Breadcrumb').findReact('li')

    this.labelFilterInput = ReactSelector('LayoutBlock')
      .withProps('id', 'Search')
      .find('input[type="text"]')

    this.timeSliderRail = ReactSelector('UI:TimeSlider')
      .findReact('Rail')

    this.placeFilter = new PlaceFilter(
      ReactSelector('LayoutBlock').withProps('id', 'PlaceFilter')
    )
    this.periodList = new PeriodList(
      ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
    )
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
