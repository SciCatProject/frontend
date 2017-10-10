import { browser, element, by, protractor } from 'protractor';

export class DashboardPage {
  
  navigateTo() {
    return browser.get('/datasets');
  }
};