import { Selector } from 'testcafe'
import { ReactSelector } from 'testcafe-react-selectors'

class PeriodList {
  constructor (list) {
    this.periodsShown = list.find('label').nth(0)
    this.periodsFiltered = list.find('p').nth(0)
  }
}

class ViewAuthority {
  constructor () {
    this.breadcrumbs = ReactSelector('UI:Breadcrumb').findReact('li')
    this.timeSliderStartHandle = Selector('.slider-handles').child(0)
    this.periodList = new PeriodList(Selector('#PeriodList'))
  }
}

export default new ViewAuthority()
