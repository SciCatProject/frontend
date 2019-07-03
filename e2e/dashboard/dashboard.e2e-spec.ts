import { LoginPage } from "../login/login.po";
import { DashboardPage } from "./dashboard.po";
import { browser, element, by } from "protractor";
import { protractor } from "protractor/built/ptor";

describe("catanie Dashboard", function() {
  let lp: LoginPage;
  let page: DashboardPage;

  beforeAll(() => {
    lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails("ingestor", "aman");
      lp.login();
      browser.sleep(2000);
      page = new DashboardPage();
      page.navigateTo();
    });
  });

  beforeEach(() => {});

  it("should be on correct page", () => {
    expect(browser.getCurrentUrl()).toContain("datasets");
  });

  it("should have an active datasets menu item", () => {
    browser.sleep(1000);
    element(by.css(".sidenav-toggle")).click();
    browser.sleep(1000);
    expect(element(by.css(".item.active")).getText()).toContain("Datasets");
    browser.actions().sendKeys(protractor.Key.ESCAPE); // close nav drawer
    browser.sleep(1000);
    const backdrop = element(by.css(".mat-drawer-backdrop"));
    backdrop.isPresent().then(p => {
      if (p) {
        backdrop.click();
      }
    });
    // ensure sidenav is closed
    browser.sleep(1000);
  });

  it("should display a table of datasets", () => {
    expect(element(by.className("mat-table")).isDisplayed()).toBeTruthy();
  });

  it("should display a toggleable archive/retrieve view and change mode", () => {
    expect(element(by.className("mode-container")).isDisplayed()).toBeTruthy();
    element(by.css(".mat-button-toggle.archive")).click();
    expect(browser.getCurrentUrl()).toContain("mode:archive");
  });


  it("should log out", () => {
    element(by.css(".sidenav-toggle")).click(); // TODO could disable animations while being tested
    browser.sleep(1000);
    element(by.className("user-menu")).click();
    browser.sleep(1000);
    element(by.className("logout-link")).click();
    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toContain("login");
  });
});
