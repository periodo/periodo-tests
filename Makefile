HOST ?= https://client.staging.perio.do
TESTS ?= */index.js

OS := $(shell uname | tr '[:upper:]' '[:lower:]')

TIMEOUT := 30000

ifeq ($(OS),darwin) # macos
run: test_chrome test_safari test_firefox
else                # linux
run: test_chrome test_firefox
endif

test_chrome: BROWSER = chrome
test_safari: BROWSER = safari
test_firefox: BROWSER = firefox

test_firefox test_chrome test_safari:
	HOST=$(HOST) \
	TIMEOUT=$(TIMEOUT) \
	BROWSER=$(BROWSER) \
	TESTS=$(TESTS) \
	./run-tests

clean:
	rm -rf node_modules
	npm install

help:
	@echo "set base URL with HOST env variable; defaults to $(HOST)"

.PHONY: help test_firefox test_chrome test_safari run clean
