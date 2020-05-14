const createTestCafe = require('testcafe')
    , ssl = require('openssl-self-signed-certificate')

let testcafe = null

createTestCafe('localhost', 1337, 1338, ssl)
  .then(tc => {
    testcafe = tc
    return tc.createRunner()
  })
  .then(runner => runner
    .src('index.js')
    // Browsers restrict self-signed certificate usage unless you
    // explicitly set a flag specific to each browser.
    // For Chrome, this is '--allow-insecure-localhost'.
    .browsers('chrome --allow-insecure-localhost')
    .run()
  )
  .then(() => {
    testcafe.close()
  })
