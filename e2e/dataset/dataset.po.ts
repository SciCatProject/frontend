import { browser } from "protractor";

export class DatasetDetailPage {
  constructor(path = "/datasets/" + browser.params.pid) {
    this.navigateTo(path);
  }

  navigateTo(path = "/datasets/" + browser.params.pid) {
    return browser.get(path);
  }
}
