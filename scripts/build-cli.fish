#!/usr/bin/env fish

xcodebuild \
    -project ./packages/cli/lidcordion.xcodeproj \
	-scheme lidcordion \
	-configuration Release \
	DEBUG_INFORMATION_FORMAT=dwarf \
	CONFIGURATION_BUILD_DIR="$PWD/packages/app/src/lib/server/bin"
