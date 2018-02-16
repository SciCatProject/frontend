import { LoginPage } from '../login/login.po';
import { DashboardPage } from './dashboard.po';
import { browser, element, by} from 'protractor';
import { protractor } from 'protractor/built/ptor';

describe('catanie Dashboard', function() {
  let lp: LoginPage;
  let page: DashboardPage;

  beforeAll(() => {
    lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails('ingestor', 'aman');
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
    element(by.className('sidenav-toggle')).click();
    browser.sleep(1000);
    expect(element(by.css('.item.active')).getText()).toContain('Home');
    browser.actions().sendKeys(protractor.Key.ESCAPE); // close nav drawer
    browser.sleep(1000);
  });

  it('should display a table of datasets', () => {
    expect(element(by.className('mat-table')).isDisplayed()).toBeTruthy();
  });

  it('should display a toggleable archive/retrieve view and change mode', () => {
    element(by.css('.mat-drawer-backdrop')).click(); // ensure sidenav is closed
    browser.sleep(1000);
    expect(element(by.className('mode-container')).isDisplayed()).toBeTruthy();
    expect(element(by.css('.button.view')).getAttribute('class')).toMatch('positive');
    element(by.css('.button.archive')).click();
    expect(browser.getCurrentUrl()).toContain('archive');
    expect(element(by.css('.button.archive')).getAttribute('class')).toMatch('positive');
  });

  // it('should change active menu item', () => {
  //   element(by.className('sidenav-toggle')).click();
  //   const eos = element(by.partialLinkText('Sample'));
  //   eos.click();
  //   expect(eos.getAttribute('class')).toContain('active');
  // });
});
