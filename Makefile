NODE_DIR=node_modules
NODE_BIN_DIR=$(NODE_DIR)/.bin
VENDOR_DIR=vendor
GAST_DIR=$(VENDOR_DIR)/gast


.PHONY: all
all: init check


.PHONY: auth
auth:
	$(NODE_BIN_DIR)/gapps auth client_secret.json


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
	$(NODE_BIN_DIR)/eslint src


.PHONY: deploy
deploy:
	$(NODE_BIN_DIR)/gapps upload


.PHONY: init
init: init-submodule $(NODE_DIR)

.PHONY: init-submodule
init-submodule: $(GAST_DIR)/README.md

$(GAST_DIR)/README.md:
	git submodule init
	git submodule update

$(NODE_DIR):
	npm install
