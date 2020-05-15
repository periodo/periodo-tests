HOST ?= https://client.staging.perio.do

localhost+2.pem localhost+2-key.pem:
	mkcert localhost 127.0.0.1 ::1
	@echo "don't forget to run mkcert -install"

run: localhost+2.pem localhost+2-key.pem
	HOST=$(HOST) node run.js

help:
	@echo "set base URL with HOST env variable; defaults to $(HOST)"

.PHONY: help run
