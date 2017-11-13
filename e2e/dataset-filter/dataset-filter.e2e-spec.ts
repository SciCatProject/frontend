import { LoginPage } from '../login/login.po';
import { DashboardPage } from '../dashboard/dashboard.po';
import { browser, element, by } from 'protractor';

describe('catanie Dataset Filters', function() {
  let lp: LoginPage;
  let page: DashboardPage;

  beforeEach(() => {
    lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails(browser.params.login.user, browser.params.login.pwd);
      lp.login();
      page = new DashboardPage();
      page.navigateTo('/datasets?text=house&groups=p16623&skip=0&initial=false');
      browser.waitForAngular();
      browser.sleep(3000);
    });
  });

  it('should contain correct url', () => {
    expect(browser.getCurrentUrl()).toContain('datasets');
    expect(browser.getCurrentUrl()).toContain('text=house');
    expect(browser.getCurrentUrl()).toContain('groups=p16623');
  });

  it('should have a prefilled search box', () => {
    expect(element(by.name('search')).getAttribute('value')).toContain('house');
  });

  it('should have a prefilled groups input', () => {
    expect(element(by.name('group')).element(by.tagName('span')).element(by.tagName('input')).getAttribute('value')).toContain('p16623');
  });
});
