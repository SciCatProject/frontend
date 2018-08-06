# Testing

## Packages

* [Chai](https://github.com/chaijs/chai) - Assertion
* [Supertest](https://github.com/visionmedia/supertest) - NodeJS testing for HTTP calls
* [Mocha](https://github.com/mochajs/mocha) - Test runner framework

## Running

`npm run test`

or 

`mocha --timeout=5000 --reporter=nyan`

## Tests

Some tests to cover the Users API and the RawDataset API have been written but more are needed. There is a LoginUtils file that supports the retrieval of tokens and everything else is documented in the Swagger file

## Environment

If this is being run independently of an infrastructure then you should provide the environment variable `NODE_ENV` to be `test`.

## Set up

In the `test/config/settings.json` file, you should have the following fields:

```
{
    "baseURL": "http://localhost:3000/",
    "apiPrefix": "api/v2/",
    "users": {
        "admin": {
            "username": "<USER>",
            "password": "<PWD>",
            "login": "api/v2/Users/login"

        },
        "user": {
            "username": "<USER>",
            "password": "<PWD>",
            "login":"auth/msad"
        },
    },
}
```

## Adding tests

This can be done one of two ways:

### Simple Tests

For simple tests, you can add it to the `test/config/tests.json` file. Each entry should have the following syntax:

```
{
    "method": "GET",
    "route": "Datasets?filter=%7B%22limit%22%3A10%7D",
    "expect": 200,
    "authenticate": "admin"
}
```

Authenticate can be user or admin, depending on the type of account you have specified.

If you include a `body` property, then that will be sent with the request.

If you include a `response` array, then the string content should be valid JS. Note that this uses the unsafe `eval` method so be careful!


### Writing Tests

If you have a chain of tests, or just tests that might be more complex, then you can write them in the `test` folder. See any `js` file in there for examples.