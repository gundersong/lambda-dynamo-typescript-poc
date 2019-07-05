#!/usr/bin/env bash
set -e

yarn typescript-json-schema ./src/types.ts IBody -o ./src/schema.json --ignore-errors

