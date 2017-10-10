import { browser, element, by } from 'protractor';

export class CataniePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root')).getText();
  }
}
