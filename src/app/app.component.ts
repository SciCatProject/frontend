const { version: appVersion } = require('../../package.json')
import {MatSidenav} from '@angular/material/sidenav';
import {Component, ViewChild, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {LoopBackConfig} from 'shared/sdk';
import {UserApi} from 'shared/sdk/services';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ua from 'state-management/actions/user.actions';
import {MatSnackBar} from '@angular/material';

import {NotificationsService} from 'angular2-notifications';

import {environment} from '../environments/environment';
import * as selectors from 'state-management/selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserApi]
})
export class AppComponent implements OnDestroy, OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  title = 'SciCat';
  appVersion = 0;
  us: UserApi;
  darkTheme$;
  username: string = null;
  message$ = null;
  msgClass$ = null;
  subscriptions = [];
  public options = {
    position: ['top', 'right'],
    lastOnBottom: true,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    timeOut: 2000
  };

  constructor(private router: Router,
              public snackBar: MatSnackBar,
              private _notif_service: NotificationsService,
              private store: Store<any>) {
    this.appVersion = appVersion;
    this.darkTheme$ = this.store.select(selectors.users.getTheme);
  }

  /**
   * Handles initial check of username and updates
   * auth service (loopback does not by default)
   * @memberof AppComponent
   */


  createNotification(msg) {
    switch (msg.type) {
      case 'error':
        this._notif_service.error(msg.title, msg.content);
        break;
      case 'alert':
        this._notif_service.alert(msg.title, msg.content);
        break;
      case 'success':
        this._notif_service.success(msg.title, msg.content);
        break;
      default:
        break;
    }
  };

  ngOnInit() {
    LoopBackConfig.setBaseURL(environment.lbBaseURL);
    console.log(LoopBackConfig.getPath());
    localStorage.clear();
    if (window.location.pathname.indexOf('logout') !== -1) {
      this.logout();
      this.router.navigate(['/login']);
    }
    this.subscriptions.push(this.store.select(state => state.root.user.message)
      .subscribe(current => {
        if (current.title !== undefined) {
            this.snackBar.open(current.title, undefined, {
              duration: 5000,
            });
            this.store.dispatch(new ua.ClearMessageAction());
        }
      }));
    this.subscriptions.push(this.store.select(state => state.root.user.currentUser)
      .subscribe(current => {
        if (current && current['username']) {
          this.username = current['username'].replace('ms-ad.', '');
          if (!('realm' in current)) {
            this.store.dispatch(new dsa.AddGroupsAction(this.username));
            this.store.dispatch(new ua.AccessUserEmailAction(this.username));
          }
        } else if (current && current['loggedOut']) {
          if (window.location.pathname.indexOf('login') === -1) {
            window.location.replace('/login');
          }
        } else {
        }
      }));
    this.store.dispatch(new ua.RetrieveUserAction());
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  logout() {
    this.store.dispatch(new ua.LogoutAction());
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  sidenavToggle() {
     this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
  }
}
