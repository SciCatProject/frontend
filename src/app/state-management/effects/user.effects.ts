// import all rxjs operators that are needed

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

import { tap, map, switchMap, filter, catchError } from 'rxjs/operators';
import { MessageType } from '../models';
import { User } from '../models';

@Injectable()
export class UserEffects {

  @Effect()
  protected loginActiveDirectory$: Observable<Action> =
    this.action$.pipe(
      ofType(UserActions.AD_LOGIN),
      map((action: UserActions.ActiveDirLoginAction) => action.form),
      switchMap((form) => {
        return this.activeDirSrv.login(form['username'], form['password']).pipe(
          switchMap(result => {
            const res = result.json();
            res['rememberMe'] = true;
            res['id'] = res['access_token'];
            // result['user'] = self.loginForm.get('username').value;
            this.authSrv.setToken(res);
            return this.userSrv.getCurrent().switchMap(
              (user) => {
                this.authSrv.setUser(user);
                res['user'] = user;
                return Observable.of(new UserActions.LoginCompleteAction(res));
              });

          }),
          catchError(err => Observable.of(new UserActions.LoginFailedAction(err.json(), 'AD'))
          ));
      }));

  @Effect()
  protected login$: Observable<Action> =
    this.action$.pipe(
      ofType(UserActions.LOGIN),
      map((action: UserActions.LoginAction) => action.form),
      switchMap((form) => {
        return this.userSrv.login(form).pipe(
          switchMap(res => {
            const user: User = res['user'];
            const isFunctional = res['accountType'] === 'functional';
            return Observable.of(new UserActions.LoginCompleteAction(user));
          }),
          catchError(err => {
            if (typeof (err) === 'string') {
              return Observable.of(new UserActions.LoginFailedAction(err, 'AD'));
            } else {
              err['errSrc'] = 'functional';
              return Observable.of(new UserActions.ActiveDirLoginAction(form));
            }

          }));
      }));

  @Effect()
  protected loginFailed$ = this.action$.pipe(
    ofType(UserActions.LOGIN_FAILED),
    map((action: UserActions.LoginFailedAction) =>
      new UserActions.ShowMessageAction({
        content: action.message,
        type: MessageType.Error
      })
    )
  );

  @Effect()
  protected $logout = this.action$.pipe(
    ofType(UserActions.LOGOUT),
    filter(() => this.userSrv.isAuthenticated()),
    switchMap(() => this.userSrv.logout()),
    map(() => new UserActions.LogoutCompleteAction()),
  );

  @Effect({ dispatch: false })
  protected navigate$ = this.action$.pipe(
    ofType(UserActions.LOGOUT_COMPLETE),
    tap(() => this.router.navigate(['/login']))
  );

  @Effect()
  protected getEmail$: Observable<Action> =
    this.action$.pipe(
      ofType(UserActions.ACCESS_USER_EMAIL),
      map((action: UserActions.AccessUserEmailAction) => action.userId),
      switchMap((userId) => {
        return this.userIdentitySrv.findOne({ 'where': { 'userId': userId } }).pipe(
          map(res => new UserActions.AccessUserEmailCompleteAction(res['profile']['email'])),
          catchError(err => Observable.of(new UserActions.AccessUserEmailFailedAction(err)))
        );
      }));

  @Effect()
  protected retrieveUser$: Observable<Action> =
    this.action$.pipe(
      ofType(UserActions.RETRIEVE_USER),
      switchMap(payload => {
        if (!this.userSrv.isAuthenticated()) {
          return Observable.of(new UserActions.RetrieveUserFailedAction(new Error('No user is logged in')));
        }

        return this.userSrv.getCurrent().pipe(
          map(res => new UserActions.RetrieveUserCompleteAction(res)),
          catchError(err => Observable.of(new UserActions.RetrieveUserFailedAction(err)))
        );
      }));

  @Effect()
  protected retrieveUserAD$: Observable<Action> =
    this.action$.pipe(
      ofType(UserActions.AD_LOGIN_COMPLETE),
      switchMap(payload => {
        return this.userSrv.getCurrent().pipe(
          map(res => new UserActions.RetrieveUserCompleteAction(res)),
          catchError(err => Observable.of(new UserActions.RetrieveUserFailedAction(err)))
            // Most likely because the user is logged out so not
            // authorised to make a call  
        );
      }));

  constructor(private action$: Actions, private store: Store<AppState>,
    private router: Router,
    private accessUserSrv: lb.AccessUserApi, private userIdentitySrv: lb.UserIdentityApi,
    private activeDirSrv: ADAuthService, private userSrv: lb.UserApi,
    private authSrv: lb.LoopBackAuth) { }
}
