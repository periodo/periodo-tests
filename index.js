import { waitForReact } from 'testcafe-react-selectors'
import page from './browse-periods'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , backendID = encodeURIComponent('web-https://data.perio.do/')

fixture('Browse canonical periods')
  .page(`${ host }?page=backend-home&backendID=${ backendID }`)
  .beforeEach(async () => { await waitForReact() })

test('First breadcrumb should say Canonical', async t => {
  await t.expect(page.firstBreadcrumb.innerText).eql('Canonical')
})

test('After filtering by label, first row label should match', async t => {
  await page.setLabelFilter('bronze')
  await t
    .expect(page.periodList.firstRow.label.textContent)
    .contains('Bronze')
})

test('Periods starting < 50000BC should be filtered by default', async t => {
  await t
    .expect(page.periodList.periodsShown.textContent)
    .match(/^[1-9]\d* periods$/, { timeout: 6000 }) // >0 periods shown
    .expect(page.periodList.periodsFiltered.textContent)
    .match(/^[1-9]\d* periods not shown/)           // >0 periods filtered
})

test('Widening the time filter should show all the periods', async t => {
  await page.setWidestTimeFilter()
  await t
    .expect(page.periodList.periodsShown.textContent)
    .match(/^[1-9]\d* periods$/)           // >0 periods shown
    .expect(page.periodList.periodsFiltered.textContent)
    .match(/^Click a period to select it/) // no periods filtered
})

test('After filtering by place, first row label should match', async t => {
  await page.setPlaceFilter('denmark')
  await t
      .expect(page.periodList.firstRow.spatialCoverage.textContent)
      .contains('Denmark')
})
