BIN = ./node_modules/.bin
MODULES = make-plural.js make-plural.amd.js make-plural.es6.js

all: $(MODULES) test

clean:
	rm -f $(MODULES)

.PHONY: all clean test test-browser release



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



release: all
	@if [ -z "$(VERSION)" ]; then echo "Release version not set! Use 'make release VERSION=...'"; echo; exit 1; fi
	@if [ `git rev-parse --abbrev-ref HEAD` != "master" ]; then echo "Not on git master branch!"; echo; exit 1; fi
	@if ! git diff-index --quiet HEAD; then echo "Git working directory is not clean!"; echo; exit 1; fi
	git checkout release
	git reset --hard master
	git add -f $(MODULES)
	git commit --message "Packaging output for release"
	npm version $(VERSION) -m "Version %s"
	git push -f origin release
	git push --tags
	npm publish
	git checkout master
