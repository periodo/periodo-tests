# UI-level tests for the PeriodO client

[![Build Status](https://travis-ci.com/periodo/periodo-tests.svg?branch=master)](https://travis-ci.com/periodo/periodo-tests)

`make run` runs tests, hopefully.

Tests run against https://client.staging.perio.do/ by default; to change this set the `HOST` environment variable:
```
HOST=http://0.0.0.0:5002/ make run
```

All tests are run by default; to change this set the `TESTS` environment variable:
```
TESTS=browse-*/index.js make run
```

If you're on macOS, tests should run on Chrome, Safari, and Firefox.

If you're on Linux, tests should run on Chrome and Firefox.

If you get SSL warnings on Firefox:

1. Make sure you have [`certutil`](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSS/Reference/NSS_tools_:_certutil) installed
   * `brew install nss` on macOS
   * `apt install libnss3-tools` or the equivalent on Linux
2. In Firefox `about://config` set `security.enterprise_roots.enabled` to `true`
3. You may need to manually import into Firefox the CA root certificate installed by `mkcert`.

Only Chrome is tested when the tests are run under continuous integration (CI). Due to the need to manually configure Firefox before it will run the tests, it is excluded from CI runs. Safari also seems to have trouble running in a CI environment, so it is excluded too.
