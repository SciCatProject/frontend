// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("karma-junit-reporter"),
      require("karma-spec-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    proxies: {
      "/assets/": "/base/src/assets/",
      "assets/": "/base/src/assets/",
    },
    mime: {
      "text/x-typescript": ["ts", "tsx"],
    },
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    junitReporter: {
      outputFile: "karma-junit.xml",
      useBrowserName: false,
      outputDir: ".",
    },
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      reporters: [
        { type: "html", subdir: "report-html" },
        { type: "lcovonly", subdir: ".", file: "lcov.info" },
        { type: "text-summary" },
      ],
      fixWebpackSourcePaths: true,
    },
    customLaunchers: {
      ChromeHeadless: {
        base: "Chrome",
        flags: [
          "--headless",
          "--disable-gpu",
          "--no-sandbox",
          // Without a remote debugging port, Google Chrome exits immediately.
          "--remote-debugging-port=9222",
        ],
      },
    },
    reporters: ["progress", "coverage", "junit", "spec"],
    specReporter: {
      suppressPassed: true, // Suppress passed tests, only show failures
      suppressSkipped: true, // Optionally suppress skipped tests too
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ["ChromeHeadless"],
    singleRun: true,
    restartOnFileChange: true,
  });
};
