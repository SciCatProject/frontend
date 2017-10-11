// import { LoginPage } from '../login/login.po';
// import { DashboardPage } from '../dashboard/dashboard.po';
// import { browser, element, by, protractor } from 'protractor';

// describe('catanie Dataset Filters', function() {
//   let lp: LoginPage;
//   let page: DashboardPage;

//   beforeAll(() => {
//     lp = new LoginPage();
//     lp.navigateTo().then(() => {
//       lp.enterDetails(browser.params.login.user, browser.params.login.pwd);
//       lp.login();
//       browser.sleep(2000);
//       page = new DashboardPage();
//       page.navigateTo('/datasets?text=house&groups=p16623&skip=0&initial=false');
//     });
//   });

//   it('should contain correct url', () => {
//     expect(browser.getCurrentUrl()).toContain('datasets');
//     expect(browser.getCurrentUrl()).toContain('text=house');
//   });

//   it('should have a prefilled search box', () => {
//     expect(element(by.name('search')).getText()).toContain('house');
//   });

//   it('should have a prefilled groups input', () => {
//     expect(element(by.name('group')).element(by.tagName('span')).element(by.tagName('input')).getText()).toContain('p16623');
//   });
// });
