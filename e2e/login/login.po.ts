import { browser, element, by, protractor } from "protractor";

export class LoginPage {
  user = element(by.id("emailInput"));
  pwd = element(by.id("pwdInput"));

  navigateTo() {
    return browser.get("/login");
  }

  enterDetails(username, passwd) {
    this.user.sendKeys(username);
    this.pwd.sendKeys(passwd);
    expect(this.user.getAttribute("value")).toEqual(username);
    expect(this.pwd.getAttribute("value")).toEqual(passwd);
  }

  login() {
    this.pwd.sendKeys(protractor.Key.ENTER);
    browser.waitForAngularEnabled(false);
    browser.sleep(5000);
    expect(browser.getCurrentUrl()).toContain("/datasets");
  }
}
