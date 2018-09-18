import { browser, element, by } from "protractor";

export class CataniePage {
  navigateTo() {
    return browser.get("/");
  }

  getParagraphText(elem) {
    return element(by.css(elem)).getText();
  }
}
