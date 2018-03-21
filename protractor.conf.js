// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
    allScriptsTimeout: 15000,
    specs: [
      './e2e/**/*.e2e-spec.ts'
    ],
    capabilities: {
        'browserName': 'chrome',
        // chromeDriver: '../node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.30',
        chromeOptions: {
            args: ["user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36", "--headless", "--disable-gpu", "--no-sandbox"],
            // args: ["--window-size=800x600"],
            prefs: {
                download: {
                    prompt_for_download: false,
                    dirctory_upgrade: true,
                    default_directory: './e2e/'
                }
            }
           
        }

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
    useAllAngular2AppRoots: true,
    beforeLaunch: function () {
        require('ts-node').register({
            project: 'e2e'
        });
    },
    onPrepare: function () {
      jasmine.getEnv().addReporter(new SpecReporter());
    }
};
