BIN = ./node_modules/.bin

make-plural.js: src/make-plural.js
	$(BIN)/babel $^ | sed 's/^module.exports = /if (typeof module !== "undefined") \0/' > $@

test: make-plural.js
	$(BIN)/mocha

test-browser: make-plural.js
	open "http://localhost:8080/test/test.html" & $(BIN)/http-server .

clean:
	rm -f make-plural*.js

.PHONY: test clean
