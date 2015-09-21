BIN := ./node_modules/.bin
NPM := npm --loglevel=error

MOCHA_ARGS = --compilers js:babel/register \
	--recursive \
	--bail \
	--trace-deprecation \
	--throw-deprecation \
	--check-leaks \
	--require ./src/__tests__/init.js \
	./src/**/*-test.js
MOCHA_TARGET = src/**/*-test.js

#
# INSTALL
#

install: node_modules/

node_modules/: package.json
	$(NPM) --ignore-scripts install
	touch node_modules/

#
# BUILD
#

build: clean install
	$(BIN)/babel ./src --out-dir ./lib
	mv -f ./lib/engines ./

#
# CLEAN
#

clean:
	rm -rf ./lib
	rm -rf ./engines

mrproper: clean
	rm -rf ./node_modules

#
# TEST
#

lint: install
	$(BIN)/eslint src

test: install
	$(BIN)/mocha $(MOCHA_ARGS) $(MOCHA_TARGET)

test-watch: install
	$(BIN)/mocha $(MOCHA_ARGS) --watch $(MOCHA_TARGET)

ci: lint test

#
# MAKEFILE
#

.PHONY: \
	install \
	build \
	clean mrproper \
	lint test test-watch ci

.SILENT:
