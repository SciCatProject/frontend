// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-jasmine-html-reporter'),
      require('karma-scss-preprocessor')
    ],
    files: [
      
      { pattern: './src/theme.scss', watched: true,  included: true, served: true },
      { pattern: './src/app/app.component.scss', watched: true,  included: true, served: true }
    ],
    preprocessors: {
      
      './src/theme.scss': ['scss'],
      './src/app/app.component.scss': ['scss']
    },
    proxies: {
      '/assets/': '/base/src/assets/',
      'assets/': '/base/src/assets/'
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true,
    },

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          '--no-sandbox',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222'
        ]
      }
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'coverage-istanbul']
              : ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    captureTimeout: 100000, 
    browserDisconnectTimeout : 20000,
    browserDisconnectTolerance : 1,
    browserNoActivityTimeout : 60000
  });
};


