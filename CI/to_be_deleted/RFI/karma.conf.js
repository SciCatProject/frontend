// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular/cli"],
    plugins: [
      require("karma-junit-reporter"),
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular/cli/plugins/karma")
    ],
    files: [{ pattern: "./src/test.ts", watched: false }],
    preprocessors: {
      "./src/test.ts": ["@angular/cli"]
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"]
    },
    remapIstanbulReporter: {
      reports: {
        html: "coverage",
        lcovonly: "./coverage/coverage.lcov"
      }
    },
    angularCli: {
      config: "./angular-cli.json",
      environment: "dev"
    },
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-gpu",
          // Without a remote debugging port, Google Chrome exits immediately.
          "--remote-debugging-port=9222"
        ]
      }
    },
    reporters:
      config.angularCli && config.angularCli.codeCoverage
        ? ["progress", "coverage-istanbul", "junit"]
        : ["progress", "junit"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    singleRun: false,
    junitReporter: {
      outputDir: "../../test",
      outputFile: "test-results.xml",
      useBrowserName: false
    }
  });
};
