BIN := ./node_modules/.bin
NPM := npm --loglevel=error

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

#
# MAKEFILE
#

.PHONY: install build clean mrproper lint

.SILENT:
