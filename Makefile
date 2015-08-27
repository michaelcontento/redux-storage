BIN=./node_modules/.bin

install: ./node_modules/

./node_modules:
	npm install --loglevel=error

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
