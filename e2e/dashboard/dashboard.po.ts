import { browser, element, by, protractor } from 'protractor';

export class DashboardPage {
  
  navigateTo(path='/datasets') {
    return browser.get(path);
  }
};