import { APP_CONFIG, AppConfig } from './app-config.module';
import { MatSidenav } from '@angular/material/sidenav';
import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { LoopBackConfig } from 'shared/sdk';
import { UserApi } from 'shared/sdk/services';
import * as ua from 'state-management/actions/user.actions';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import * as selectors from 'state-management/selectors';
import { getCurrentUser } from 'state-management/selectors/users.selectors';

const { version: appVersion } = require('../../package.json');


// import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserApi],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy, OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  private userObs$ = this.store.pipe(select(getCurrentUser));

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
    private titleService: Title,
    public snackBar: MatSnackBar,
    // private _notif_service: NotificationsService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private store: Store<any>) {
    this.appVersion = appVersion;
    this.darkTheme$ = this.store.select(selectors.users.getTheme);
    const facility = this.appConfig.facility;
    let status = 'test';
    if (this.appConfig.production === true) {
      status = '';
    }
    this.title = 'SciCat' + ' ' + facility + ' ' + status;
    this.setTitle(this.title);
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  /**
   * Handles initial check of username and updates
   * auth service (loopback does not by default)
   * @memberof AppComponent
   */
  ngOnInit() {
    LoopBackConfig.setBaseURL(environment.lbBaseURL);
    console.log(LoopBackConfig.getPath());
    if ('lbApiVersion' in environment) {
      const lbApiVersion = environment['lbApiVersion'];
      LoopBackConfig.setApiVersion(lbApiVersion);
    }

    localStorage.clear();
    if (window.location.pathname.indexOf('logout') !== -1) {
      this.logout();
      // this.router.navigate(['/login']);
    }

    this.subscriptions.push(this.store.select(state => state.root.user.message)
      .subscribe(current => {
        if (current.content !== undefined) {
          this.snackBar.open(current.content, undefined, {
            duration: current.duration,
          });
          this.store.dispatch(new ua.ClearMessageAction());
        }
      }));
    this.subscriptions.push(this.store.select(state => state.root.user.currentUser)
      .subscribe(current => {
            //console.log("current.user.username: ", current.user.username);
            //console.log("state.root.user: ", state.root.user.loggedIn);
            console.log("current: ", current);
            if (current) {
              if (('username' in current)) {
                this.username = current.username.replace('ms-ad.', '');
                //this.store.dispatch(new dsa.AddGroupsAction(current.id));
                //this.username = this.username;
                this.store.dispatch(new ua.AccessUserEmailAction(current.id));
                // TODO handle dataset loading
              }
            } else {
              this.username = null;
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
    this.sidenav.close();
    this.store.dispatch(new ua.LogoutAction());
  }

  login() {
    this.router.navigateByUrl('/login');
  }

  sidenavToggle() {
    this.sidenav.opened ? this.sidenav.close() : this.sidenav.open();
  }
}
