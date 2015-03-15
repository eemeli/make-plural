BIN = ./node_modules/.bin

all: make-plural.js make-plural.amd.js make-plural.es6.js test

make-plural.js: src/make-plural.js
	$(BIN)/babel $^ | sed 's/^module.exports = /if (typeof module !== "undefined") \0/' > $@

make-plural.amd.js: src/make-plural.js
	$(BIN)/babel $^ --modules amd -o $@

make-plural.es6.js: src/make-plural.js
	$(BIN)/babel $^ --blacklist es6.modules -o $@

test: make-plural.js
	$(BIN)/mocha

test-browser: make-plural.js
	open "http://localhost:8080/test/test.html" & $(BIN)/http-server .

clean:
	rm -f make-plural*.js

.PHONY: all test test-browser clean
