const createTestCafe = require('testcafe')
    , { readFileSync } = require('fs')
    , { platform } = require('os')

const ssl = {
  cert: readFileSync('./localhost+2.pem', { encoding: 'utf8' }),
  key: readFileSync('./localhost+2-key.pem', { encoding: 'utf8' }),
}

let testcafe = null

const browsers = [ 'chrome', 'firefox' ]

if (platform() === 'darwin') {
  browsers.push('safari')
}

createTestCafe('localhost', 1337, 1338, ssl)
  .then(tc => {
    testcafe = tc
    return tc.createRunner()
  })
  .then(runner => runner
    .src('index.js')
    .browsers(browsers)
    .run()
  )
  .then(() => {
    testcafe.close()
  })
