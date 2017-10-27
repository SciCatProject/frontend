import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {LoopBackConfig} from 'shared/sdk';
import {UserApi} from 'shared/sdk/services';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ua from 'state-management/actions/user.actions';

import {NotificationsService} from 'angular2-notifications';

import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // template: '<simple-notifications [options]="options"></simple-notifications>',
  providers: [UserApi]
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'CATANIE';
  us: UserApi;
  username: string = null;
  message$ = null;
  msgClass$ = null;
  subscriptions = [];
  options = [];

  constructor(private router: Router,
              private _service: NotificationsService,
              private store: Store<any>) {
  }

  /**
   * Handles initial check of username and updates
   * auth service (loopback does not by default)
   * @memberof AppComponent
   */


  create() {
    this._service.success(
      'Some Title',
      'Some Content',
      {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      }
    )
  };

  ngOnInit() {

    LoopBackConfig.setBaseURL(environment.lbBaseURL);
    console.log(LoopBackConfig.getPath());
    localStorage.clear();
    if (window.location.pathname.indexOf('logout') !== -1) {
      this.logout();
      this.router.navigate(['/login']);
    }
    this.message$ = this.store.select(state => state.root.user.message.content);
    this.msgClass$ = this.store.select(state => state.root.user.message.class);
    this.subscriptions.push(this.store.select(state => state.root.user.currentUser)
      .subscribe(current => {
        if (current && current['username']) {
          this.username = current['username'].replace('ms-ad.', '');
          if (!('realm' in current)) {
            this.store.dispatch(
              {type: dsa.ADD_GROUPS, payload: this.username});
            this.store.dispatch(
              {type: ua.ACCESS_USER_EMAIL, payload: this.username});
          }
        } else if (current && current['loggedOut']) {
          if (window.location.pathname.indexOf('login') === -1) {
            window.location.replace('/login');
          }
        }
      }));
    this.store.dispatch({type: ua.RETRIEVE_USER});
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  logout() {
    this.store.dispatch({type: ua.LOGOUT});
  }

  login() {
    this.router.navigateByUrl('/login');
  }
}
