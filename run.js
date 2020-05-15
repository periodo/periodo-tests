const createTestCafe = require('testcafe')
    , { readFileSync } = require('fs')

const ssl = {
  cert: readFileSync('./localhost+2.pem', { encoding: 'utf8' }),
  key: readFileSync('./localhost+2-key.pem', { encoding: 'utf8' }),
}

let testcafe = null

createTestCafe('localhost', 1337, 1338, ssl)
  .then(tc => {
    testcafe = tc
    return tc.createRunner()
  })
  .then(runner => runner
    .src('index.js')
    .browsers([
      'chrome',
      'firefox',
      'safari',
    ])
    .run()
  )
  .then(() => {
    testcafe.close()
  })
