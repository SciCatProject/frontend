import { LoginPage } from './login.po';
import { browser, element, by } from 'protractor';
describe('catanie Login', function () {
  let lp: LoginPage;

  beforeAll(() => {
    lp = new LoginPage();
    browser.get('/logout');
    browser.sleep(2000);
    lp.navigateTo();
  });

  it('should not have hamburger menu visible', () => {
    // element.all(by.css('.sidenav-toggle')).then(function (items) {
    //   expect(items.length).toBe(0);
    // });
    expect(element(by.css('.sidenav-toggle')).isPresent()).toBeFalsy();
  });

  it('should route to login automatically', () => {
    expect(browser.getCurrentUrl()).toContain('login');
  });

  it('should match input details', () => {
    lp = new LoginPage();
    lp.enterDetails(browser.params.login.user, browser.params.login.pwd);
  });

  it('should login with correct credentials', () => {
    lp.login();
  });

  it('should have hamburger menu visible after login', () => {
    expect(element(by.css('.sidenav-toggle')).isPresent()).toBeTruthy();
  });

  it('should have three tabs for functional accounts', () => {

  });
});
