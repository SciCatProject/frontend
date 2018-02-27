import { browser } from 'protractor';

export class DashboardPage {

  constructor(path = '/Datasets') {
      this.navigateTo(path);
  }

  navigateTo(path = '/datasets') {
    return browser.get(path);
  }
}
