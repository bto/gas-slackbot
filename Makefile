CONFIG_DIR=config
DIST_DIR=dist
NODE_DIR=node_modules
SRC_DIR=src
VENDOR_DIR=vendor
GAST_DIR=$(VENDOR_DIR)/gast

SRC_FILES=$(SRC_DIR)/*.js


.PHONY: all
all: init check push test-gas build


.PHONY: build
build:
	npx uglifyjs --config-file $(CONFIG_DIR)/uglifyjs.json --beautify beautify $(SRC_FILES) --output $(DIST_DIR)/SlackBot.js
	npx uglifyjs --config-file $(CONFIG_DIR)/uglifyjs.min.json $(SRC_FILES) --output $(DIST_DIR)/SlackBot.min.js


.PHONY: clean
clean:
	rm $(DIST_FILE)

.PHONY: distclean
distclean: clean
	rm -rf $(NODE_DIR)
	rm -rf $(GAST_DIR)
	rm -rf $(DIST_DIR)/*


.PHONY: check
check: check-lint

.PHONY: check-lint
check-lint:
	npx eslint -c src/eslintrc src
	npx eslint -c test/eslintrc test


.PHONY: init
init: init-sample init-submodule init-node

.PHONY: init-sample
init-sample: .clasp.json test/config.js
.clasp.json: .clasp.json.sample
	cp $< $@
test/config.js: test/config.js.sample
	cp $< $@

.PHONY: init-submodule
init-submodule: $(GAST_DIR)/README.md
$(GAST_DIR)/README.md:
	git submodule init
	git submodule update

.PHONY: init-node
init-node: $(NODE_DIR)
$(NODE_DIR):
	npm install


.PHONY: login
login:
	npx clasp login


.PHONY: login-creds
login-creds:
	npx clasp login --creds creds.json


.PHONY: logs
logs:
	npx clasp logs


.PHONY: push
push:
	npx clasp push


.PHONY: test
test: test-gas test-js

.PHONY: test-gas
test-gas:
	npx clasp run testRunner

.PHONY: test-js
test-js:
	NODE_ENV=test npx mocha
