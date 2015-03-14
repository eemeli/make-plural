BIN = ./node_modules/.bin

make-plural.js: src/make-plural.js
	$(BIN)/babel $^ | sed 's/^module.exports = /if (typeof module !== "undefined") \0/' > $@

test:
	$(BIN)/mocha

clean:
	rm -f make-plural*.js

.PHONY: test clean
