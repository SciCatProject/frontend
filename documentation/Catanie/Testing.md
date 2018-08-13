
# [Testing](https://angular.io/docs/ts/latest/guide/testing.html)

# Browser Choices

Testing can be run on any browser installed on your system. To change this, you can update the settings found in `protractor.conf.js` and `karma.conf.js`

## Headless Chrome 

As of Chrome 59, a [headless](https://developers.google.com/web/updates/2017/04/headless-chrome) option has been added, by using the `--headless` flag (`--disable-gpu` is also required in the early versions). In order to run tests in this Chrome by default, first check you have 59 or above at `chrome://version`.

### `protractor.conf.js`

```json
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: ["--headless", "--disable-gpu", "--window-size=800x600"]
        }
    },
```

### `karma.conf.js`

```json
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          '--remote-debugging-port=9222'
        ]
      }
    },
```


# E2E ([Protractor](http://www.protractortest.org/#/))


You can run with `npm run e2e` or `ng e2e` 

Useful Links

* [Testing Components](http://chariotsolutions.com/blog/post/testing-angular-2-components-unit-tests-testcomponentbuilder/)
* [Testing Services](http://chariotsolutions.com/blog/post/testing-http-services-angular-2-jasmine/)

## Testing Structure

An e2e test should be used to test the functionality as if a user is utilising it. They test a whole `story`, such as logging in or searching for an item. Protractor provides excellent element selection facilities for this functionality. Most of these tests can be written by simply redirecting the browser to relevant URLs, but this makes it hard to test complex interactions.

### Page Objects

We can create a `PAGE.po.ts` file to encapsulate common actions for a page and import it throughout our testing. For example, a login page object would navigate to the login page and provide methods for `login`, `logout` etc by entering text in the correct elements. You can see this in the `e2e` folder within the repo.

### e2e Spec

This is where the actual tests are written, with an example below:

```javascript

describe('catanie Dashboard', function() {
  let lp: LoginPage;
  let page: DashboardPage;

  beforeAll(() => {
    lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails(browser.params.login.user, browser.params.login.pwd);
      lp.login();
      browser.sleep(2000);
      page = new DashboardPage();
      page.navigateTo();
    });
  });

  it('should be on correct page', () => {
    expect(browser.getCurrentUrl()).toContain('datasets');
  });

  it('should have an active home menu item', () => {
    expect(element(by.css('.active.item')).getText()).toContain('Home');
  });

  it('should change active menu item', () => {
    const eos = element(by.partialLinkText('End of Shift'));
    eos.click();
    expect(eos.getAttribute('class')).toContain('active');
  });
});
```

We can execute specific actions before each/any test is run, as well as retrieving elements by almost any means necessary. Note that there is a lot of specific support for Angular as well, which you can read about in the Protractor docs.

### Element Explorer

Running protractor with `--elementExplorer` opens up your pages with Protractor and gives you a CLI to test out element queries and interactions with them.

# Unit (Jasmine, run by Karma)

## Testing Components

Often, when testing a component or a piece of UX, then we would want to test all the functionality. In most cases, this is not necessary and results in testing more than just the one component. In the case of Angular, that could be things like the router module or a custom service. These things can be mocked in the `Spec` file to ensure that we do not end up importing more than we need.

### Mocking Services

Create a mock service and implement only what you need

```
class MockUserApi {

  getCurrentId() {
    return 123;
  }
}
```

Now, set your testbed to override the service you are mocking.

```
TestBed.overrideComponent(AppComponent, {
    set: {
      providers: [
        { provide: UserApi, useClass: MockUserApi }
      ]
    }
```

The practice I have followed is to create a `MockStubs` file that contains only the necessary mocked methods for services or pipes or components. This file can be added to to allow almost complete coverage of the app.

### Components with @Input()

This may seem trivial but online guides do provide conflicting results. Some recommendations are to make test wrapper components and this is absolutely what you should do if you need to test the actual inputs.

However, if you are testing a component you can mock the Input [variable](https://angular.io/docs/ts/latest/guide/testing.html#!#dashboard-standalone) or, even more simple, you can set it as a default value (null, false etc) in the definition of your component; your component logic should be validating these anyway.

### Schemas and Components with Nested Components 

If you have created a component that nests another component within, that means that all modules must be imported in both the test module, as well as all components that utilises that component. Confused yet? So was I. This is technically good practice for integration tests but less suitable if you want to test each isolated component. A test on a component with an embedded component should, in my opinion, test only itself; the embedded components should have its own tests.

This can be fixed with the `NO_ERRORS_SCHEMA` import from `@angular/core`.

```
import {NO_ERRORS_SCHEMA} from '@angular/core';
 TestBed.configureTestingModule({
       schemas : [ NO_ERRORS_SCHEMA ],
```

This should be set in **all** components that contain the component in question. The component that contains the module should **not** do this and should import the module(s). All tests should exist there.

# Anatomy of a Test 

Here we discuss the breakdown of a test for a component or service. It should be noted that the default tests generated for a component (by the Angular CLI) will fail almost as soon as the component is set up. This section will explain why and what should be done. Some of the points discussed here are mainly in line with the Angular best practices described in ng-book and the docs, but not all of this needs to be followed to the letter.

## BeforeEach

These are called to set up the test and involve 2 important methods.

### `configureTestingModule`

This should include imports for all the modules used in the component. If the component also includes other components, then they should be included. This is also true for any pipes that may be used in the template. I am not sure if there is a fix for this but that does mean that, if a subcomponent uses a pipe then it should be included in all the specs.

### `overrideComponent`

Test cases for a component should test as few things outside of the component as possible (services etc should have their own tests), but this causes problems for the services implemnted in each component. This is especially true for the loopback services, but also HTTP and Router. In the `overrideComponent` method, you can specify the service names and provide an alternative class to use.

For every service your component uses, there should be a `Mock` equivalent that provides hardcoded data in response to their calls. First, check the service exists in `MockStubs.ts` in the root of the `app` folder. If it is not in there, please implement it only in that file.  You do **not** need to implement every method, others can add to these when they are needed.

The format in the `spec` file should be as follows:
```
{ provide: RawDatasetApi, useClass: MockDatasetApi }
```

The default test merely tests the creation of a component. This is merely opinion but a component should not be considered complete on a branch until the initial tests pass. A release should not go live untilthe coverage of the tests covers more than just basic functionality, i.e. 80% coverage.


## State management/NGRX testing 


Tests of ngrx state management should test e.g. if a new state object is returned.

Sample ngrx reducer test:
```javascript
  describe('SelectDatasetAction', () => {
    it('should return the state', () => {
      const data:DatasetInterface = {owner: '', contactEmail: '', sourceFolder: '', creationTime: new Date(), type: '', ownerGroup: ''};
      const payload = new Dataset({pid: 'pid 1', ...data});
      const action = new fromActions.SelectDatasetAction(payload);
      const state = fromDatasets.datasetsReducer(initialDatasetState, action);
      expect(state.selectedSets2).toEqual([payload]);
      expect(state.selectedSets2.constructor).toBe(Array);
    });
  });
```
