import { LoginPage } from './login.po';
import { browser } from 'protractor';

describe('catanie Login', function() {
  let lp: LoginPage;

  beforeAll(() => {
    lp = new LoginPage();
    browser.get('/logout');
    browser.sleep(2000);
    lp.navigateTo();
  });

  it('should route to login automatically', () => {
    expect(browser.getCurrentUrl()).toContain('login');
  });

  it('should match input details', () => {
    lp = new LoginPage();
    lp.enterDetails('ingestor', 'aman');
  });

  it('should login with correct credentials', () => {
    lp.login();
  });
});
