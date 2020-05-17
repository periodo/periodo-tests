import { waitForReact } from 'testcafe-react-selectors'
import page from './browse-periods'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , backendID = encodeURIComponent('web-https://data.perio.do/')

fixture('Browse canonical periods')
  .page(`${ host }?page=backend-home&backendID=${ backendID }`)
  .beforeEach(async () => { await waitForReact() })

// test('First breadcrumb should say Canonical', async t => {
//   await t.expect(page.firstBreadcrumb.innerText).eql('Canonical')
// })

test('After filtering by label, first row label should match', async t => {
  await page.setLabelFilter('bronze')
  await t
    .expect(page.periodList.firstRow.label.textContent)
    .contains('Bronze')
})

test('Periods starting < 50000BC should be filtered by default', async t => {
  await t
    .expect(page.periodList.periodsShown.textContent)
    .match(/^[1-9]\d* periods$/, { timeout: 12000 }) // >0 periods shown
    .expect(page.periodList.periodsFiltered.textContent)
    .match(/^[1-9]\d* periods not shown/)            // >0 periods filtered
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

test('Selecting a facet value should update other facets', async t => {
  await page.facets['authority']
    .selectValue('Norsk arkeologisk leksikon. 2005.')

  await t
    .expect(page.facets['language'].values.count)
    .eql(1)
    .expect(page.facets['language'].values.textContent)
    .eql('Norwegian')

  await t
    .expect(page.facets['spatialCoverage'].values.count)
    .eql(1)
    .expect(page.facets['spatialCoverage'].values.textContent)
    .eql('Norway')
})

test('Clicking a row should show its details below', async t => {
  await page.periodList.firstRow.click()
  const label = await page.periodDetails.originalLabel()
  await t
    .expect(page.periodList.firstRow.label.textContent)
    .eql(label.textContent)
})
