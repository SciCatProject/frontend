// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as DatasetActions from 'state-management/actions/datasets.actions';
import * as UserActions from 'state-management/actions/user.actions';
// import store state interface
import {AppState} from 'state-management/state/app.store';
import {ADAuthService} from 'users/adauth.service';

@Injectable()
export class UserEffects {


  @Effect()
  protected loginActiveDirectory$: Observable<Action> =
      this.action$.ofType(UserActions.AD_LOGIN)
          .debounceTime(300)
          .map(toPayload)
          .switchMap((form) => {
            return this.activeDirSrv.login(form['username'], form['password'])
                .switchMap(result => {
                  const res = result.json();
                  console.log(res);
                  res['rememberMe'] = true;
                  res['id'] = res['access_token'];
                  // result['user'] = self.loginForm.get('username').value;
                  this.authSrv.setToken(res);
                  this.userSrv.getCurrent().subscribe(
                      user => { this.authSrv.setUser(user); });
                  return Observable.of(
                      {type : UserActions.AD_LOGIN_COMPLETE, payload : res});
                })
                .catch(err => {
                  const error = {'message': err.json(), 'errSrc': 'AD'};
                  return Observable.of(
                      {type : UserActions.LOGIN_FAILED, payload : error});
                });
          });

  @Effect()
  protected messageTimeout$: Observable<Action> =
      this.action$.ofType(UserActions.SHOW_MESSAGE)
          .map(toPayload)
          .switchMap((message) => {
            const to = message.timeout ? message.timeout : 6;
            return Observable.timer(to * 1000)
            .switchMap(() => Observable.of({ type: UserActions.CLEAR_MESSAGE }));
          });

  @Effect()
  protected login$: Observable<Action> =
      this.action$.ofType(UserActions.LOGIN)
          .debounceTime(300)
          .map(toPayload)
          .switchMap((form) => {
            return this.userSrv.login(form)
                .switchMap(res => {
                  res['user']['accountType'] = 'functional';
                  return Observable.of(
                      {type : UserActions.LOGIN_COMPLETE, payload : res});
                })
                .catch(err => {
                  console.log(err);
                  if (typeof(err) === 'string') {
                    const error = {'message': err, 'errSrc': 'AD'};
                    return Observable.of(
                        {type : UserActions.LOGIN_FAILED, payload : error});                    
                  } else {
                    err['errSrc'] = 'functional';
                    return Observable.of(
                        {type : UserActions.AD_LOGIN, payload : form});                    
                  }

                });
          });

  @Effect()
  protected logout$: Observable<Action> =
      this.action$.ofType(UserActions.LOGOUT)
          .debounceTime(300)
          .switchMap((payload) => {
            if(this.userSrv.isAuthenticated()) {
              return this.userSrv.logout().switchMap(res => {
                return Observable.of({type : UserActions.LOGOUT_COMPLETE});
              });
            } else {
              return Observable.of({type : UserActions.LOGOUT_COMPLETE});
            }
          });

  @Effect()
  protected getGroups$: Observable<Action> =
      this.action$.ofType(DatasetActions.ADD_GROUPS)
          .debounceTime(300)
          .map(toPayload)
          .switchMap((payload) => {
            return this.accessUserSrv.findById(payload)
                .switchMap(res => {
                  return Observable.of({
                    type : UserActions.ADD_GROUPS_COMPLETE,
                    payload : res['memberOf']
                  });
                })
                .catch(err => {
                  console.error(err);
                  return Observable.of(
                      {type : UserActions.ADD_GROUPS_FAILED, payload : err});
                });
          });

  @Effect()
  protected getEmail$: Observable<Action> =
      this.action$.ofType(UserActions.ACCESS_USER_EMAIL)
          .debounceTime(300)
          .map(toPayload)
          .switchMap((action) => {
            return this.accessUserSrv.findById(action)
                .switchMap(res => {
                  return Observable.of({
                    type : UserActions.ACCESS_USER_EMAIL_COMPLETE,
                    payload : res['mail']
                  });
                })
                .catch(err => {
                  console.error(err);
                  return Observable.of({
                    type : UserActions.ACCESS_USER_EMAIL_FAILED,
                    payload : err
                  });
                });
          });

  @Effect()
  protected retrieveUser$: Observable<Action> =
      this.action$.ofType(UserActions.RETRIEVE_USER)
          .debounceTime(300)
          .switchMap(payload => {
            if (!this.userSrv.isAuthenticated()) {
              return Observable.of({
                  type : UserActions.RETRIEVE_USER_FAILED, 
                  payload : new Error('No user is logged in')
                });
            }

            return this.userSrv.getCurrent()
                .switchMap(res => {
                  return Observable.of({
                    type : UserActions.RETRIEVE_USER_COMPLETE,
                    payload : res
                  });
                })
                .catch(err => {
                  return Observable.of(
                      {type : UserActions.RETRIEVE_USER_FAILED, payload : err});
                });
          });

  @Effect()
  protected retrieveUserAD$: Observable<Action> =
      this.action$.ofType(UserActions.AD_LOGIN_COMPLETE)
          .debounceTime(300)
          .switchMap(payload => {
            return this.userSrv.getCurrent()
                .switchMap(res => {
                  return Observable.of({
                    type : UserActions.RETRIEVE_USER_COMPLETE,
                    payload : res
                  });
                })
                .catch(err => {
                  // Most likely because the user is logged out so not
                  // authorised to make a call
                  return Observable.of(
                      {type : UserActions.RETRIEVE_USER_FAILED, payload : err});
                });
          });

  constructor(private action$: Actions, private store: Store<AppState>,
              private accessUserSrv: lb.AccessUserApi,
              private activeDirSrv: ADAuthService, private userSrv: lb.UserApi,
              private authSrv: lb.LoopBackAuth) {}
}
