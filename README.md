# Catanie

## ISSUES

Angular cli is currently unable to respond to hosts that do not match. See [here](https://github.com/angular/angular-cli/issues/6070) for explanation about webpack changes but will break a dev docker build (should not affect production as we would not use ng serve). Unsure if you can hardcode a docker IP (probably not a great idea).

## Running

Running locally: `ng serve` ([catamel](https://gitlab.psi.ch/melanie/catamel) will need to be running)

Running through docker: `docker build -t <tag_name> .; docker run <tag_name>`


## Auto generated below

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.30.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to GitHub Pages

Run `ng github-pages:deploy` to deploy to GitHub Pages.

## Further help

To get more help on the `angular-cli` use `ng help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
