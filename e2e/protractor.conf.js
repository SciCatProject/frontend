// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    allScriptsTimeout: 15000,
    specs: [
      './**/*.e2e-spec.ts'
    ],
    capabilities: {
        'browserName': 'chrome',

    },
    params: {
        login: {
            user: 'ingestor',
            pwd: 'aman'
        },
        pid: '20.500.11935%2F0006c3e0-d1fa-440c-8ed0-431a9636f9bc'
    },
    directConnect: true,
    getPageTimeout: 15000,
    baseUrl: 'http://localhost:4200/',
    framework: 'jasmine',
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000,
        print: function () {}
    },
    onPrepare () {
        require('ts-node').register({
            project: 'e2e/tsconfig.e2e.json'
      });
      jasmine.getEnv().addReporter(new SpecReporter());
    }
};
