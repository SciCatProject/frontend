# OpenAPI Generator - What is that?
The OpenAPI Generator is an open source tool that provides code generators to generate client libraries, server stubs and API documentation from an OpenAPI specification (e.g. *openapi.yaml* or *open-api.json*).
The tool works as follows:
* Input: It takes an OpenAPI specification file (e.g. *openapi.yaml* or *openapi.json*) that describes how the API works, including endpoints, parameters, response structures and data models.
* Generator selection: You choose a generator (e.g. for *TypeScript Angular*).
* Output: The generator automatically creates source code that can be used to communicate with the API or as a framework for the API implementation.


# How to install the OpenAPI Generator
## Installation via Docker
```
docker pull openapitools/openapi-generator-cli
```


# How do I use the OpenAPI Generator for TypeScript Angular?
## Prerequisites
* OpenAPI Generator has been installed
* openapi.yaml is available

## Generation of Typescript Angular objects
### Using Docker
```
docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
-i /local/openapi.yaml \
-g typescript-angular \
-o /local/out
```

* -i: Path of the input file (openapi.yaml)
* -g: Generator type (*typescript-angular*)
* -o: target directory

### Using the OpenAPI Generator CLI
```
openapi-generator-cli generate \

-i openapi.yaml \
-g typescript-angular \
-o /local/out \
```

Optional specify angular version: 
```
--additional-properties=ngVersion=16
```

## Integration into an angular project
* Copy the generated files from the *./local/out/model* folder into your Angular project (model folder).


# openapi.yaml as input for OpenAPI Generator
OpenAPI.yaml contains the following things:
* Endpoints: Which URL routes are available and what they do.
* HTTP methods: GET, POST, PUT, DELETE etc.
* Parameters: Query parameters, body data, etc.
* Responses: status codes and return data (e.g. JSON objects)


