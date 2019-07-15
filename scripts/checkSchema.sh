#!/usr/bin/env bash
set -e

# Check if the schema is different, exit non-zero if schema is changed
# This means that the schema will be up-to-date with the types
git diff --exit-code ./src/schema/

