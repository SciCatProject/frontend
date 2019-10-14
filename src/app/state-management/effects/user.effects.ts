import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import { Observable, of } from "rxjs";
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  concatMap
} from "rxjs/operators";

import * as UserActions from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";

import {
  UserApi,
  AccessToken,
  LoopBackAuth,
  SDKToken,
  User,
  UserIdentityApi,
  UserIdentity
} from "shared/sdk";
import { ADAuthService } from "users/adauth.service";

@Injectable()
export class UserEffects {
  /**
   * First, try AD login
   * If succesful, go to fetchUser$
   * If error, go to funcLogin$
   */
  @Effect()
  protected adLogin$ = this.action$.pipe(
    ofType<UserActions.ActiveDirLoginAction>(UserActions.AD_LOGIN),
    map(action => action.form),
    switchMap(({ username, password, rememberMe }) =>
      this.activeDirSrv.login(username, password).pipe(
        map(({ body }) => new UserActions.ActiveDirLoginSuccessAction(body)),
        catchError(() =>
          of(
            new UserActions.ActiveDirLoginFailedAction(
              username,
              password,
              rememberMe
            )
          )
        )
      )
    )
  );

  /**
   * Set access token and try to find the AD user in catamel
   * If succesful, trigger a LoginCompleteAction
   * If error, trigger a LoginFailedAction
   */
  @Effect()
  protected fetchUser$ = this.action$.pipe(
    ofType<UserActions.ActiveDirLoginSuccessAction>(
      UserActions.AD_LOGIN_SUCCESS
    ),
    switchMap(({ response }) => {
      const token = new SDKToken({
        id: response.access_token,
        userId: response.userId
      });
      this.lbAuth.setToken(token);
      return this.userApi.findById(response.userId).pipe(
        map(
          (user: User) => new UserActions.LoginCompleteAction(user, "external")
        ),
        catchError(() => of(new UserActions.LoginFailedAction()))
      );
    })
  );

  @Effect()
  protected loginRedirect$ = this.action$.pipe(
    ofType<UserActions.ActiveDirLoginFailedAction>(UserActions.AD_LOGIN_FAILED),
    map(
      ({ username, password, rememberMe }) =>
        new UserActions.LoginAction({ username, password, rememberMe })
    )
  );

  /**
   * Try to login with a functional account
   * If succesful, trigger a LoginCompleteAction
   * If error, trigger a LoginFailedAction
   */
  @Effect()
  protected funcLogin$ = this.action$.pipe(
    ofType<UserActions.LoginAction>(UserActions.LOGIN),
    map(action => action.form),
    switchMap(({ username, password, rememberMe }) =>
      this.userApi.login({ username, password, rememberMe }).pipe(
        map(
          ({ user }) => new UserActions.LoginCompleteAction(user, "functional")
        ),
        catchError(() => of(new UserActions.LoginFailedAction()))
      )
    )
  );

  @Effect()
  protected loginFailed$ = this.action$.pipe(
    ofType(UserActions.LOGIN_FAILED),
    map(
      () =>
        new UserActions.ShowMessageAction({
          content: "Could not log in. Check your username and password.",
          type: MessageType.Error,
          duration: 5000
        })
    )
  );

  @Effect()
  protected $logout = this.action$.pipe(
    ofType(UserActions.LOGOUT),
    filter(() => this.userApi.isAuthenticated()),
    switchMap(() => this.userApi.logout()),
    map(() => new UserActions.LogoutCompleteAction())
  );

  @Effect({ dispatch: false })
  protected navigate$ = this.action$.pipe(
    ofType(UserActions.LOGOUT_COMPLETE),
    tap(() => this.router.navigate(["/login"]))
  );

  @Effect()
  protected deselectColumn$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.DESELECT_COLUMN),
    map((action: UserActions.DeselectColumnAction) => action.columnName),
    concatMap(columnName => [
      new UserActions.DeselectColumnCompleteAction(columnName)
    ])
  );

  @Effect()
  protected selectColumn$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.SELECT_COLUMN),
    map((action: UserActions.DeselectColumnAction) => action.columnName),
    concatMap(columnName => [
      new UserActions.SelectColumnCompleteAction(columnName)
    ])
  );

  @Effect()
  protected retrieveUser$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.RETRIEVE_USER),
    switchMap(() => {
      if (!this.userApi.isAuthenticated()) {
        return of(
          new UserActions.RetrieveUserFailedAction(
            new Error("No user is logged in")
          )
        );
      }
      return this.userApi.getCurrent().pipe(
        map(res => new UserActions.RetrieveUserCompleteAction(res)),
        catchError(err => of(new UserActions.RetrieveUserFailedAction(err)))
      );
    })
  );

  @Effect()
  protected initUserIdentityRetrieval$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.RETRIEVE_USER_COMPLETE),
    map((action: UserActions.RetrieveUserCompleteAction) => action.user.id),
    map(id => new UserActions.RetrieveUserIdentAction(id))
  );

  @Effect()
  protected retrieveUserIdentity$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.RETRIEVE_USER_IDENTITY),
    switchMap((action: UserActions.RetrieveUserIdentAction) =>
      this.userIdentityApi.findOne({ where: { userId: action.id } })
    ),
    map(
      (userIdentity: UserIdentity) =>
        new UserActions.RetrieveUserIdentCompleteAction(userIdentity)
    ),
    catchError(err =>
      of(
        new UserActions.RetrieveUserFailedAction(
          new Error("Failed to load user identity")
        )
      )
    )
  );

  @Effect()
  protected fetchCatamelToken$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.FETCH_CATAMEL_TOKEN),
    switchMap(() => of(this.userApi.getCurrentToken())),
    map(
      (res: AccessToken) => new UserActions.FetchCatamelTokenCompleteAction(res)
    ),
    catchError(err => of(new UserActions.FetchCatamelTokenFailedAction(err)))
  );

  constructor(
    private action$: Actions,
    private activeDirSrv: ADAuthService,
    private router: Router,
    private userApi: UserApi,
    private userIdentityApi: UserIdentityApi,
    private lbAuth: LoopBackAuth
  ) {}
}
