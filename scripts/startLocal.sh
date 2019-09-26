#!/usr/bin/env bash
set -e

API_PORT=${API_PORT:-"3000"}
DYNAMO_PORT=${DYNAMO_PORT:-"8000"}

ORIG_PATH="$( pwd )"
APP_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. >/dev/null && pwd )"
LOCAL_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/../local >/dev/null && pwd )"

# Get table properties from serverless
cd ${APP_PATH}
TABLE_DETAILS=$(sls print --format json --path 'resources.Resources.DynamoTable.Properties' | jq 'del(.SSESpecification)' )
TABLE_NAME=$(echo $TABLE_DETAILS | jq '.TableName' | tr -d '"')

# Only compose and create table if docker is NOT running and table already exists
echo 'Checking if local dynamo container exists... (may take a few seconds)'
if ! aws dynamodb describe-table --table-name $TABLE_NAME --endpoint-url http://localhost:$DYNAMO_PORT >/dev/null ;
then
  echo 'Starting local Dynamo Container...'
  cd ${LOCAL_PATH}
  DYNAMO_PORT=$DYNAMO_PORT docker-compose up -d --force-recreate
  echo 'Creating table in local Docker Container...'
  aws dynamodb create-table --cli-input-json "$TABLE_DETAILS" --endpoint-url http://localhost:$DYNAMO_PORT
fi

# Start serverless offline with the serverless version installed in the project
cd ${APP_PATH}
echo 'Starting Serverless Offline...'
API_PORT=$API_PORT DYNAMO_PORT=$DYNAMO_PORT yarn serverless offline start

cd ${ORIG_PATH}
