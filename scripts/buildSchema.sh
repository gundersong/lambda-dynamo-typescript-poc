#!/usr/bin/env bash
set -e

putFile="./src/schema/putEvent.schema.json"
postFile="./src/schema/postEvent.schema.json"

echo "Building schemas..."
yarn typescript-json-schema ./src/types.ts IPutRequestSchema --ignore-errors --required -o $putFile
yarn typescript-json-schema ./src/types.ts IPostRequestSchema --ignore-errors --required -o $postFile
