import { browser, element, by } from 'protractor';

export class DatasetsPage {
  navigateTo() {
    return browser.get('/datasets');
  }

  getParagraphText() {
    return element(by.css('app-root')).getText();
  }
}
