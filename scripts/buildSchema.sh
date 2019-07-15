#!/usr/bin/env bash
set -e

echo "Building schema..."
yarn typescript-json-schema ./src/types.ts IEvent -o ./src/schema/event.schema.json --ignore-errors --required

