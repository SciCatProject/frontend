#!/bin/bash

set -e

# Download the Swagger schema
curl -o ./swagger-schema.json http://localhost:3000/explorer-json

# Remove the existing SDK directory if it exists
rm -rf ./sdk

# Run the OpenAPI Generator CLI in a Docker container to generate the SDK
docker run \
    --rm \
    -v "${PWD}":/local \
    openapitools/openapi-generator-cli generate \
    -i /local/swagger-schema.json \
    -g typescript-angular \
    -o /local/sdk \
    --additional-properties=withInterfaces=true,ngVersion=16.2.12

# Remove the Swagger schema file
rm ./swagger-schema.json