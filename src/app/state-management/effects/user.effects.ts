import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action } from "@ngrx/store";

import { Observable, of } from "rxjs";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";

import * as UserActions from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";

import { LoginService } from "users/login.service";
import { UserApi } from "shared/sdk";

@Injectable()
export class UserEffects {
  
  @Effect()
  protected login$ = this.action$.pipe(
    ofType<UserActions.LoginAction>(UserActions.LOGIN),
    map(action => action.form),
    switchMap(({username, password, rememberMe}) => this.loginSrv.login$(username, password, rememberMe)),
    map(res => res 
      ? new UserActions.LoginCompleteAction(res.user, res.accountType)
      : new UserActions.LoginFailedAction()
    )
  );

  @Effect()
  protected loginFailed$ = this.action$.pipe(
    ofType(UserActions.LOGIN_FAILED),
    map(() => new UserActions.ShowMessageAction({
      content: 'Could not log in. Check your username and password.',
      type: MessageType.Error,
      duration: 5000
    }))
  );

  @Effect()
  protected $logout = this.action$.pipe(
    ofType(UserActions.LOGOUT),
    filter(() => this.userSrv.isAuthenticated()),
    switchMap(() => this.userSrv.logout()),
    map(() => new UserActions.LogoutCompleteAction())
  );

  @Effect({ dispatch: false })
  protected navigate$ = this.action$.pipe(
    ofType(UserActions.LOGOUT_COMPLETE),
    tap(() => this.router.navigate(["/login"]))
  );

  @Effect()
  protected retrieveUser$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.RETRIEVE_USER),
    switchMap(() => {
      if (!this.userSrv.isAuthenticated()) {
        return of(
          new UserActions.RetrieveUserFailedAction(
            new Error("No user is logged in")
          )
        );
      }

      return this.userSrv.getCurrent().pipe(
        map(res => new UserActions.RetrieveUserCompleteAction(res)),
        catchError(err => of(new UserActions.RetrieveUserFailedAction(err)))
      );
    })
  );

  constructor(
    private action$: Actions,
    private router: Router,
    private userSrv: UserApi,
    private loginSrv: LoginService,
  ) {}
}
