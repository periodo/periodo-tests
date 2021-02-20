HOST ?= https://client.staging.perio.do
TESTS ?= */index.js

OS := $(shell uname | tr '[:upper:]' '[:lower:]')

TIMEOUT := 30000

ifeq ($(OS),darwin) # macos
BROWSER ?= chrome,firefox,safari
else                # linux
BROWSER ?= chrome,firefox
endif

run:
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

.PHONY: help run clean
