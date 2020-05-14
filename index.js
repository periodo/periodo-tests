import { waitForReact, ReactSelector } from 'testcafe-react-selectors'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , page = 'backend-home'
    , backendID = encodeURIComponent('web-https://data.perio.do/')

fixture('Browse canonical periods')
  .page(`${ host }?page=${ page }&backendID=${ backendID }`)
  .beforeEach(async () => { await waitForReact() })

test('Breadcrumb should say Canonical', async t => {
  await t.expect(
    ReactSelector('UI:Breadcrumb')
      .findReact('li')
      .innerText
  ).eql('Canonical')
})

test('After filtering by label, first row label should match', async t => {
  const periodList = ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
      , firstRow = periodList.findReact('ItemRow')
      , label = firstRow.find('span').nth(2)

  const search = ReactSelector('LayoutBlock').withProps('id', 'Search')
      , input = search.find('input[type="text"]')

  await t
    .typeText(input, 'bronze')
    .expect(label.textContent)
    .contains('Bronze')
})

test('Periods starting < 50000BC should be filtered', async t => {
  const periodList = ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
      , label = periodList.findReact('label')
      , p = periodList.findReact('p')

  await t
    .expect(label.textContent)
    .match(/^[1-9]\d* periods$/, { timeout: 5000 }) // >0 periods shown
    .expect(p.textContent)
    .match(/^[1-9]\d* periods not shown/)           // >0 periods filtered
})

test('Widening the time filter should show all the periods', async t => {
  const periodList = ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
      , label = periodList.findReact('label')
      , p = periodList.findReact('p')

  const slider = ReactSelector('UI:TimeSlider')
      , rail = slider.findReact('Rail')

  await t
    .click(rail, { offsetX: 5 })           // click left edge of rail
    .expect(label.textContent)
    .match(/^[1-9]\d* periods$/)           // >0 periods shown
    .expect(p.textContent)
    .match(/^Click a period to select it/) // no periods filtered
})

test('After filtering by place, first row label should match', async t => {
  const periodList = ReactSelector('LayoutBlock').withProps('id', 'PeriodList')
      , firstRow = periodList.findReact('ItemRow')
      , spatialCoverage = firstRow.find('span').nth(5)

  const placeFilter = ReactSelector('LayoutBlock').withProps('id', 'PlaceFilter')
      , selectPlacesLink = placeFilter.find('a')

  const placeSuggest = ReactSelector('UI:PlaceSuggest')
      , input = placeSuggest.find('input[type="text"]')

  await t
      .click(selectPlacesLink)
      .typeText(input, 'denmark')
      .pressKey('down')
      .pressKey('enter')
      .expect(spatialCoverage.textContent)
      .contains('Denmark')
})
