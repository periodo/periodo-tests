HOST ?= https://client.staging.perio.do

MKCERT_U := https://github.com/FiloSottile/mkcert/releases/download/
MKCERT_V := v1.4.1

OS := $(shell uname | tr '[:upper:]' '[:lower:]')

ifdef CI
  ifeq ($(OS),darwin)
  BROWSERS = chrome,safari
  else
  BROWSERS = chrome
  endif
else
  ifeq ($(OS),darwin)
  BROWSERS = chrome,safari,firefox:userProfile
  else
  BROWSERS = chrome,firefox:userProfile
  endif
endif

mkcert:
	wget $(MKCERT_U)$(MKCERT_V)/mkcert-$(MKCERT_V)-$(OS)-amd64 -O mkcert
	chmod +x mkcert

localhost+2.pem localhost+2-key.pem: mkcert
	./mkcert -install
	./mkcert localhost 127.0.0.1 ::1

run: localhost+2.pem localhost+2-key.pem
	HOST=$(HOST) npx testcafe \
	--hostname 127.0.0.1 \
	--ssl "cert=$(word 1,$^);key=$(word 2,$^);" \
	$(BROWSERS) index.js

help:
	@echo "set base URL with HOST env variable; defaults to $(HOST)"

.PHONY: help run
