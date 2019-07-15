#!/usr/bin/env bash
set -e

yarn typescript-json-schema ./src/types.ts IEvent -o ./src/schema/event.schema.json --ignore-errors --required

