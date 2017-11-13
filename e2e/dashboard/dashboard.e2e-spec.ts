import { LoginPage } from '../login/login.po';
import { DashboardPage } from './dashboard.po';
import { browser, element, by} from 'protractor';

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
    expect(element(by.css('.active.item')).getText()).toContain('Home');
  });

  it('should change active menu item', () => {
    const eos = element(by.partialLinkText('Sample Data Entry'));
    eos.click();
    expect(eos.getAttribute('class')).toContain('active');
  });
});
