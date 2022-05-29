import { waitForReact } from 'testcafe-react-selectors'
import page from './page'

const host = process.env.HOST || 'https://client.staging.perio.do'
    , backendID = encodeURIComponent('web-https://data.perio.do/')
    , authorityID = 'p0323gx'

console.log(`Client hosted at ${ host }`)
console.log('Server hosted at https://data.perio.do/')

fixture('View authority')
  .page(`${ host }/?page=authority-view&backendID=${ backendID }&authorityID=${ authorityID }`)
  .beforeEach(async () => { await waitForReact() })

test('Second breadcrumb should be authority source', async t => {
  await t.expect(page.breadcrumbs.nth(1).textContent)
    .eql('Olivia P. Judson. The energy expansions of evolution. 2017-04-28.')
})

test('Time filter should be widened by default', async t => {
  await t.expect(page.timeSliderStartHandle.textContent).eql('5Ga')
})

test('All the periods in the authority should be shown ', async t => {
  await t
    .expect(page.periodList.periodsShown.textContent)
    .match(/^[1-9]\d* periods$/, { timeout: 12000 }) // >0 periods shown
    .expect(page.periodList.periodsFiltered.textContent)
    .match(/^Click a period to select it/)           // no periods filtered
})
