# End-to-end tests for the PeriodO client

Tests the [PeriodO client](https://github.com/periodo/periodo-client) by running it in an actual browser against a live [PeriodO server](https://github.com/periodo/periodo-server).

[![periodo client end-to-end tests status](https://github.com/periodo/periodo-tests/actions/workflows/run-tests.yml/badge.svg)](https://github.com/periodo/periodo-tests/actions/workflows/run-tests.yml)

`make run` runs the tests.

Tests run against https://client.staging.perio.do/ by default; to change this set the `HOST` environment variable:
```
HOST=http://127.0.0.1:5002 make run
```
