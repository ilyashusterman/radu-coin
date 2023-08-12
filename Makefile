# Makefile for CryptoCurrency Dashboard Extension

# Variables
VSCODE_EXTENSION_NAME = plovcoin

# Default target
all: build publish

# Build the extension
build:
	@echo "Building the extension..."
	vsce package
	@echo "Extension packaged successfully."

# Publish the extension
publish:
	@echo "Publishing the extension..."
	vsce publish
	@echo "Extension published successfully."

# Clean up generated files
clean:
	@echo "Cleaning up..."
	rm -f $(VSCODE_EXTENSION_NAME)-*.vsix
	@echo "Cleanup completed."

# Help target
help:
	@echo "Available targets:"
	@echo "  build     - Build the extension"
	@echo "  publish   - Publish the extension"
	@echo "  clean     - Clean up generated files"
	@echo "  help      - Display this help message"
