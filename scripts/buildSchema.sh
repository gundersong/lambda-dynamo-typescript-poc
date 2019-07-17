#!/usr/bin/env bash
set -e

file="./src/schema/putEvent.schema.json"

echo "Building schema..."
yarn typescript-json-schema ./src/types.ts IPutRequestSchema --ignore-errors --required -o $file

