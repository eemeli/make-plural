VT = \033[$(1)m
VT0 := $(call VT,0)
VT_DIM := $(call VT,2)
VT_HL := $(call VT,33;1)
CHK := $(call VT,32;1)✓${VT0}
ERR := $(call VT,31;1)✖${VT0}

GH_API_FETCH_VALUE = curl -s https://api.github.com/$(1) | grep -m1 '"$(2)"' | cut -d: -f2 | sed 's/^ *"\?//;s/"\?, *$$//'

GH_REPO = eemeli/make-plural.js
NPM_TAG = latest

BIN = ./node_modules/.bin
CLDR = node_modules/cldr-core
DATA = data/plurals.json data/ordinals.json
COMPILED = bin/make-plural plurals.js plurals.min.js make-plural.js make-plural.min.js

.PHONY: all clean lint test test-browser release-check-init release-check-branch release-check-head release

all: $(DATA) $(COMPILED) .make_lint .make_test
clean: ; rm -rf $(COMPILED) .make_* bin/ data/
bin data: ; mkdir -p $@


make-plural.js: src/make-plural.js
	$(BIN)/browserify $< -t babelify -s MakePlural -o $@

bin/make-plural: src/index.js | bin
	echo "#!/usr/bin/env node\n" > $@
	$(BIN)/babel $< >> $@
	chmod a+x $@

plurals.js: bin/make-plural make-plural.js $(DATA)
	./$< > $@

%.min.js: %.js
	$(BIN)/uglifyjs $< --compress --mangle -o $@

data/%.json: $(CLDR)/supplemental/%.json | data
	cp $< $@



lint: .make_lint
.make_lint: src/make-plural.js
	$(BIN)/eslint $^
	@touch $@

test: .make_test
.make_test: make-plural.js plurals.js test/* $(DATA)
	@echo "\n  $(VT_DIM)Testing code...$(VT0)"
	@$(BIN)/mocha test/code.js
	@echo "\n  $(VT_DIM)Testing data...$(VT0)"
	@$(BIN)/mocha test/data.js
	@echo "$(CHK) All tests passed"
	@touch $@

test-browser: make-plural.js test/* $(DATA)
	open "http://localhost:8080/test/" & $(BIN)/http-server .



release-check-init:
	@if [ -z "$(VERSION)" ]; then echo "$(ERR) Release version not set! Use 'make release VERSION=... [NPM_TAG=...]'\n"; exit 1; fi
	@if ! git diff-index --quiet HEAD; then echo "$(ERR) Git working directory is not clean!\n"; exit 1; fi
	@echo "$(CHK) Git working directory is clean"
	@echo "  $(VT_DIM)Fetching remote data from github...$(VT0)"

release-check-branch:
	$(eval GH_BRANCH := $(shell $(call GH_API_FETCH_VALUE,repos/$(GH_REPO),default_branch)))
	$(eval GH_BRANCH_PRETTY := $(VT_HL)$(GH_BRANCH)$(VT0))
	@if [ `git rev-parse --abbrev-ref HEAD` != "$(GH_BRANCH)" ]; then echo "$(ERR) Not on default branch $(GH_BRANCH_PRETTY)!\n"; exit 1; fi
	@echo "$(CHK) Local branch matches remote default $(GH_BRANCH_PRETTY)"

release-check-head: release-check-branch
	$(eval GH_HEAD := $(shell $(call GH_API_FETCH_VALUE,repos/$(GH_REPO)/git/refs/heads/$(GH_BRANCH),sha)))
	$(eval GH_HEAD_PRETTY := $(VT_HL)$(shell echo "$(GH_HEAD)" | cut -c1-7)$(VT0))
	@if [ `git rev-parse HEAD` != "$(GH_HEAD)" ]; then echo "$(ERR) Local HEAD doesn't match remote HEAD $(GH_HEAD_PRETTY)\n"; exit 1; fi
	@echo "$(CHK) Local HEAD matches remote HEAD $(GH_HEAD_PRETTY)"

release: all release-check-init release-check-branch release-check-head
	@echo "$(CHK) All release checks passed\n"
	@printf "  Push new tag $(VT_HL)v$(VERSION)$(VT0) to github and publish as $(VT_HL)$(VERSION)$(VT0) @ $(VT_HL)$(NPM_TAG)$(VT0) on npm?"
	@read -p " [y/N] " -n 1 -r -s; \
		if [[ $${REPLY} =~ ^[Yy]$$ ]]; then echo "$${REPLY}\r$(CHK)\n"; \
		else echo "\r$(ERR)\n"; exit 1; fi
	git checkout $(GH_HEAD)
	git add -f $(DATA) $(COMPILED)
	git commit --message "Packaging data & transpiled modules for release"
	npm version $(VERSION) -m "Version %s"
	git push --tags
	npm publish --tag $(NPM_TAG)
	git checkout $(GH_BRANCH)
