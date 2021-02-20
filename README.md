# End-to-end tests for the PeriodO client

Tests the [PeriodO client](https://github.com/periodo/periodo-client) by running it in an actual browser against a live [PeriodO server](https://github.com/periodo/periodo-server).

![periodo client end-to-end tests status](https://github.com/periodo/periodo-tests/actions/workflows/run-tests.yml/badge.svg)

`make run` runs tests, hopefully.

Tests run against https://client.staging.perio.do/ by default; to change this set the `HOST` environment variable:
```
HOST=http://127.0.0.1:5002 make run
```

All tests are run by default; to change this set the `TESTS` environment variable:
```
TESTS=browse-*/index.js make run
```

If you're on macOS, tests should run on Chrome, Safari, and Firefox.

If you're on Linux, tests should run on Chrome and Firefox.

Only Chrome is tested when the tests are run under continuous integration (CI).

To manually specify which browsers to test, set the `BROWSER` environment variable:
```
BROWSER=safari,firefox
```

