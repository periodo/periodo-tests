import { Selector } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors'

class PeriodList {
  constructor (list) {
    this.periodsShown = list.findReact('label')
    this.periodsFiltered = list.findReact('p')
  }
}

class ViewAuthority {
  constructor () {
    this.breadcrumbs = ReactSelector('UI:Breadcrumb')
      .findReact('li')

    this.timeSliderStartHandle = Selector('.slider-handles').child(0)

    this.periodList = new PeriodList(
      ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
    )
  }
}

export default new ViewAuthority()
