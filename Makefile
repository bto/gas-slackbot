NODE_DIR=node_modules
NODE_BIN_DIR=$(NODE_DIR)/.bin
VENDOR_DIR=vendor
GAST_DIR=$(VENDOR_DIR)/gast


.PHONY: all
all: init check


.PHONY: clean
clean:

.PHONY: distclean
distclean: clean
	rm -rf $(NODE_DIR)
	rm -rf $(GAST_DIR)


.PHONY: check
check: check-lint

.PHONY: check-lint
check-lint:
	$(NODE_BIN_DIR)/eslint src test


.PHONY: init
init: init-sample init-submodule init-node

.PHONY: init-sample
init-sample: .clasp.json gapps.config.json src/appsscript.json
.clasp.json: .clasp.json.sample
	cp $< $@
gapps.config.json: gapps.config.json.sample
	cp $< $@
src/appsscript.json: src/appsscript.json.sample
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
	$(NODE_BIN_DIR)/clasp login


.PHONY: login-creds
login-creds:
	$(NODE_BIN_DIR)/clasp login --creds creds.json


.PHONY: logs
logs:
	$(NODE_BIN_DIR)/clasp logs


.PHONY: push
push:
	$(NODE_BIN_DIR)/clasp push


.PHONY: test
test: test-gas test-js

.PHONY: test-gas
test-gas:
	$(NODE_BIN_DIR)/clasp run testRunner

.PHONY: test-js
test-js:
	NODE_ENV=test $(NODE_BIN_DIR)/mocha
