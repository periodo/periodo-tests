HOST ?= https://client.staging.perio.do
CLIENT_BRANCH ?= master

OS := $(shell uname | tr '[:upper:]' '[:lower:]')

TIMEOUT := 30000

run:
	HOST=$(HOST) \
	TIMEOUT=$(TIMEOUT) \
	./run-tests

start_client:
	rm -rf periodo-client
	git clone \
	--branch $(CLIENT_BRANCH) \
	--single-branch \
	https://github.com/periodo/periodo-client.git
	$(MAKE) -C periodo-client start
	@echo Started serving client branch $(CLIENT_BRANCH)

run_on_branch: start_client
	HOST=http://127.0.0.1:5002 \
	TIMEOUT=$(TIMEOUT) \
	./run-tests
	$(MAKE) -C periodo-client stop

clean:
	rm -rf node_modules
	npm install
	npx --yes update-browserslist-db@latest

help:
	@echo "set base URL with HOST env variable; defaults to $(HOST)"

.PHONY: help start_client run run_on_branch clean
