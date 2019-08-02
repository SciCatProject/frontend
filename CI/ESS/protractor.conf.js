// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require("jasmine-spec-reporter").SpecReporter;

exports.config = {
  allScriptsTimeout: 11000,
  specs: ["./e2e/**/*.e2e-spec.ts"],
  capabilities: {
    browserName: "chrome",
    // chromeDriver: '../node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.30',
    chromeOptions: {
      // args: ["--headless", "--disable-gpu", "--window-size=800x600"]
      args: ["no-sandbox", "headless", "disable-gpu"]
      //args: ["--window-size=800x600"]
    }
  },
  params: {
    login: {
      user: "ingestor",
      pwd: "aman"
    }
  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require("ts-node").register({
      project: "e2e"
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
