BIN = ./node_modules/.bin
NPM = npm --loglevel=error

#
# INSTALL
#

install: node_modules/

node_modules/: package.json
	echo "> Installing ..."
	$(NPM) --ignore-scripts install > /dev/null
	touch node_modules/

#
# CLEAN
#

clean:
	echo "> Cleaning ..."
	rm -rf build/

mrproper: clean
	echo "> Cleaning deep ..."
	rm -rf node_modules/

#
# BUILD
#

build: clean install
	echo "> Building ..."
	BABEL_ENV=cjs $(BIN)/babel src/ --out-dir build/
	BABEL_ENV=es $(BIN)/babel src/ --out-dir build-es/

build-watch: clean install
	echo "> Building forever ..."
	BABEL_ENV=cjs $(BIN)/babel src/ --out-dir build/ --watch

#
# TEST
#

lint: install
	echo "> Linting ..."
	$(BIN)/eslint src/

test: install
	echo "> Testing ..."
	$(BIN)/mocca

test-watch: install
	echo "> Testing forever ..."
	$(BIN)/mocca --watch

#
# PUBLISH
#

_publish : NODE_ENV ?= production
_publish: lint test build

publish-fix: _publish
	$(BIN)/release-it --increment patch

publish-feature: _publish
	$(BIN)/release-it --increment minor

publish-breaking: _publish
	$(BIN)/release-it --increment major

#
# MAKEFILE
#

.PHONY: \
	install \
	clean mrproper \
	build build-watch \
	lint test test-watch \
	publish-fix publish-feature publish-breaking

.SILENT:
