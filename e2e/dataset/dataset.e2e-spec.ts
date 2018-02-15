import { LoginPage } from '../login/login.po';
import { DatasetDetailPage } from './dataset.po';
import { browser, element, by} from 'protractor';
import { protractor } from 'protractor/built/ptor';

describe('catanie Dataset Detail', function() {
  let lp: LoginPage;
  let page: DatasetDetailPage;

  beforeAll(() => {
    lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails('ingestor', 'aman');
      lp.login();
      browser.sleep(2000);
      page = new DatasetDetailPage();
      page.navigateTo();
    });
  });

  it('should be on correct page', () => {
    expect(browser.getCurrentUrl()).toContain('dataset/' + browser.params.pid);
  });

});
