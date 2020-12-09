HOST ?= https://client.staging.perio.do
TESTS ?= */index.js

MKCERT_U := https://github.com/FiloSottile/mkcert/releases/download/
MKCERT_V := v1.4.1

OS := $(shell uname | tr '[:upper:]' '[:lower:]')

TIMEOUT := 10000

ifdef CI # continuous integration server
  run: test_chrome    # firefox still broken on travis ci
else     # development desktop
  ifeq ($(OS),darwin) # macos
  run: test_chrome test_safari test_firefox
  else                # linux
  run: test_chrome test_firefox
  endif
endif

mkcert:
	wget $(MKCERT_U)$(MKCERT_V)/mkcert-$(MKCERT_V)-$(OS)-amd64 -O mkcert
	chmod +x mkcert

localhost+2.pem localhost+2-key.pem: mkcert
	./mkcert -install
	./mkcert localhost 127.0.0.1 ::1

test_chrome: BROWSER = chrome
test_safari: BROWSER = safari
test_safari: TIMEOUT = 30000 # safari is slow
test_firefox: BROWSER = firefox

test_firefox test_chrome test_safari: localhost+2.pem localhost+2-key.pem
	HOST=$(HOST) npx testcafe \
	--hostname 127.0.0.1 \
	--ssl "cert=$(word 1,$^);key=$(word 2,$^);" \
	--selector-timeout $(TIMEOUT) \
	--stop-on-first-fail \
	$(BROWSER) $(TESTS)

clean:
	rm -rf node_modules
	npm install

help:
	@echo "set base URL with HOST env variable; defaults to $(HOST)"

.PHONY: help test_firefox test_chrome test_safari run clean
