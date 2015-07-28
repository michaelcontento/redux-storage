BIN=./node_modules/.bin

install: ./node_modules/

./node_modules:
	npm install --loglevel=error

build: clean
	$(BIN)/babel ./src --out-dir ./lib

clean:
	rm -rf ./lib/

lint:
	$(BIN)/eslint src

.PHONY: install build clean lint

.SILENT:
