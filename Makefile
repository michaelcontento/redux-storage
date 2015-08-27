BIN=./node_modules/.bin

install: node_modules/

node_modules/: package.json
	npm install --loglevel=error --ignore-scripts
	touch node_modules/

build: clean install
	$(BIN)/babel ./src --out-dir ./lib
	mv -f ./lib/engines ./

clean:
	rm -rf ./lib
	rm -rf ./engines

lint: install
	$(BIN)/eslint src

.PHONY: install build clean lint

.SILENT:
