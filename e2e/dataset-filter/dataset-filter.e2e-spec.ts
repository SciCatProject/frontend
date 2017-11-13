import {browser, by, element} from 'protractor';

import {DashboardPage} from '../dashboard/dashboard.po';
import {LoginPage} from '../login/login.po';

describe('catanie Dataset Filters', function() {
  let lp: LoginPage;
  let page: DashboardPage;
  const urlParams =
      '/datasets?text=house&groups=p16623&skip=0&initial=false&mode=View';

  beforeAll(() => {
   /* lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails(browser.params.login.user, browser.params.login.pwd);
      lp.login();
    });*/
  });

  it('should contain correct url', () => {
      page = new DashboardPage();
    page.navigateTo(urlParams).then(
        () => { expect(browser.getCurrentUrl()).toContain(urlParams); });
  });

  it('should have a prefilled search box', () => {
    page.navigateTo(urlParams).then(() => {
      expect(element(by.name('search')).getAttribute('value'))
          .toContain('house');
    });
  });

  it('should have a prefilled groups input', () => {
    page.navigateTo(urlParams).then(() => {
      element(by.css('.ui-autocomplete-token-label')).getText().then(text => {
        expect(text).toContain('p16623');
      });
    });
  });
});
