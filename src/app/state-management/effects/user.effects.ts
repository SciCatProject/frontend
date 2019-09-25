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
  concatMap,
  mergeMap
} from "rxjs/operators";

import * as UserActions from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";

import { LoginService } from "users/login.service";
import { UserApi, AccessToken } from "shared/sdk";

@Injectable()
export class UserEffects {
  @Effect()
  protected login$ = this.action$.pipe(
    ofType<UserActions.LoginAction>(UserActions.LOGIN),
    map(action => action.form),
    switchMap(({ username, password, rememberMe }) => {
      return this.loginSrv.login$(username, password, rememberMe).pipe(
        mergeMap((res: any) => [
          new UserActions.LoginCompleteAction(res.user, res.accountType),
          res.user.accountType !== "functional"
            ? new UserActions.RetrieveUserIdentAction(res.user.id)
            : null
        ]),
        catchError(err => of(new UserActions.LoginFailedAction()))
      );
    })
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
      this.loginSrv.getUserIdent$(action.id)
    ),
    map(res => new UserActions.RetrieveUserIdentCompleteAction(res)),
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
    private router: Router,
    private userApi: UserApi,
    private loginSrv: LoginService
  ) {}
}
