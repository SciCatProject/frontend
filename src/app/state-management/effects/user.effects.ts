// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as DatasetActions from 'state-management/actions/datasets.actions';
import * as UserActions from 'state-management/actions/user.actions';
// import store state interface
import { AppState } from 'state-management/state/app.store';
import { ADAuthService } from 'users/adauth.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserEffects {

  @Effect()
  protected loginActiveDirectory$: Observable<Action> =
    this.action$.ofType(UserActions.AD_LOGIN)
      .debounceTime(300)
      .map((action: UserActions.ActiveDirLoginAction) => action.payload)
      .switchMap((form) => {
        return this.activeDirSrv.login(form['username'], form['password'])
          .switchMap(result => {
            const res = result.json();
            res['rememberMe'] = true;
            res['id'] = res['access_token'];
            // result['user'] = self.loginForm.get('username').value;
            this.authSrv.setToken(res);
            return this.userSrv.getCurrent().switchMap(
              user => {
                this.authSrv.setUser(user);
                res['user'] = user;
                return Observable.of(new UserActions.LoginCompleteAction(res));
              });

          })
          .catch(err => {
            const error = { 'message': err.json(), 'errSrc': 'AD' };
            return Observable.of(new UserActions.LoginFailedAction(error));
          });
      });

  @Effect()
  protected login$: Observable<Action> =
    this.action$.ofType(UserActions.LOGIN)
      .debounceTime(300)
      .map((action: UserActions.LoginAction) => action.payload)
      .switchMap((form) => {
        return this.userSrv.login(form)
          .switchMap(res => {
            res['user']['accountType'] = 'functional';
            console.log(res);
            return Observable.of(new UserActions.LoginCompleteAction(res));
          })
          .catch(err => {
            console.log(err);
            if (typeof (err) === 'string') {
              const error = { 'message': err, 'errSrc': 'AD' };
              return Observable.of(new UserActions.LoginFailedAction(error));
            } else {
              err['errSrc'] = 'functional';
              return Observable.of(new UserActions.ActiveDirLoginAction(form));
            }

          });
      });

  @Effect()
  protected logout$: Observable<Action> =
    this.action$.ofType(UserActions.LOGOUT)
      .debounceTime(300)
      .switchMap((payload) => {
        if (this.userSrv.isAuthenticated()) {
          return this.userSrv.logout().switchMap(res => {
            return Observable.of(new UserActions.LogoutCompleteAction());
          });
        } else {
          return Observable.of(new UserActions.LogoutCompleteAction());
        }
      });

      @Effect({ dispatch: false })
      navigate$ = this.action$.pipe(
        ofType(UserActions.LOGOUT_COMPLETE),
        tap(() => this.router.navigate(['/login']))
      );

  @Effect()
  protected getGroups$: Observable<Action> =
    this.action$.ofType(DatasetActions.ADD_GROUPS)
      .debounceTime(300)
      .map((action: DatasetActions.AddGroupsAction) => action.payload)
      .switchMap((payload) => {
        return this.userIdentitySrv.findOne({ 'where': { 'userId': payload } })
          .switchMap(res => {
            return Observable.of(new UserActions.AddGroupsCompleteAction(res['profile']['accessGroups']));
          })
          .catch(err => {
            console.error(err);
            return Observable.of(new UserActions.AddGroupsFailedAction(err));
          });
      });

  @Effect()
  protected getEmail$: Observable<Action> =
    this.action$.ofType(UserActions.ACCESS_USER_EMAIL)
      .debounceTime(300)
      .switchMap((action) => {
        return this.accessUserSrv.findById(action)
          .switchMap(res => {
            return Observable.of(new UserActions.AccessUserEmailCompleteAction(res['email']));
          })
          .catch(err => {
            console.error(err);
            return Observable.of(new UserActions.AccessUserEmailFailedAction(err));
          });
      });

  @Effect()
  protected retrieveUser$: Observable<Action> =
    this.action$.ofType(UserActions.RETRIEVE_USER)
      .debounceTime(300)
      .switchMap(payload => {
        if (!this.userSrv.isAuthenticated()) {
          return Observable.of(new UserActions.RetrieveUserFailedAction(new Error('No user is logged in')));
        }

        return this.userSrv.getCurrent()
          .switchMap(res => {
            return Observable.of(new UserActions.RetrieveUserCompleteAction(res));
          })
          .catch(err => {
            return Observable.of(new UserActions.RetrieveUserFailedAction(err));
          });
      });

  @Effect()
  protected retrieveUserAD$: Observable<Action> =
    this.action$.ofType(UserActions.AD_LOGIN_COMPLETE)
      .debounceTime(300)
      .switchMap(payload => {
        return this.userSrv.getCurrent()
          .switchMap(res => {
            return Observable.of(new UserActions.RetrieveUserCompleteAction(res));
          })
          .catch(err => {
            // Most likely because the user is logged out so not
            // authorised to make a call
            return Observable.of(new UserActions.RetrieveUserFailedAction(err));
          });
      });

  constructor(private action$: Actions, private store: Store<AppState>,
    private router: Router,
    private accessUserSrv: lb.AccessUserApi, private userIdentitySrv: lb.UserIdentityApi,
    private activeDirSrv: ADAuthService, private userSrv: lb.UserApi,
    private authSrv: lb.LoopBackAuth) { }
}
