import { browser } from 'protractor';

export class DatasetDetailPage {

  constructor(path = '/dataset/' + browser.params.pid) {
      this.navigateTo(path)
  }

  navigateTo(path = '/dataset/' + browser.params.pid) {
    return browser.get(path);
  }
};
