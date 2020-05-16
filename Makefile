HOST ?= https://client.staging.perio.do
MKCERT ?= mkcert

MKCERT_U := https://github.com/FiloSottile/mkcert/releases/download/
MKCERT_V := v1.4.1

localhost+2.pem localhost+2-key.pem:
ifneq ($(MKCERT),mkcert)
	wget $(MKCERT_U)$(MKCERT_V)/mkcert-$(MKCERT_V)-linux-amd64 -O mkcert
	chmod +x mkcert
endif
	sudo $(MKCERT) -install
	sudo $(MKCERT) localhost 127.0.0.1 ::1

run: localhost+2.pem localhost+2-key.pem
	sudo HOST=$(HOST) node run.js

help:
	@echo "set base URL with HOST env variable; defaults to $(HOST)"

.PHONY: help run
