// import all rxjs operators that are needed

import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import * as lb from "shared/sdk/services";
import * as UserActions from "state-management/actions/user.actions";
// import store state interface
import { AppState } from "state-management/state/app.store";
import { ADAuthService } from "users/adauth.service";
import { Router } from "@angular/router";
import { catchError, filter, map, switchMap, tap } from "rxjs/operators";
import { MessageType, User, UserIdentity } from "../models";

@Injectable()
export class UserEffects {
  @Effect()
  protected loginActiveDirectory$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.AD_LOGIN),
    map((action: UserActions.ActiveDirLoginAction) => action.form),
    switchMap(form => {
      return this.activeDirSrv.login(form["username"], form["password"]).pipe(
        switchMap(result => {
          const res = {
            id: result.body["access_token"],
            rememberMe: true,
            scopes: "u1",
            created: null,
            user: null,
            userId: result.body["userId"],
            ttl: 86400
          };

          // result['user'] = self.loginForm.get('username').value;
          console.log("AD login ");
          this.authSrv.setToken(res);
          return this.userSrv.getCurrent().pipe(
            switchMap(user => {
              this.authSrv.setUser(user);
              res["user"] = user;
              this.userIdentitySrv
                .findOne({ where: { userId: res["user"]["userId"] } })
                .subscribe(res2 => new UserActions.RetrieveUserIdentityCompleteAction(res2 as UserIdentity));
              return of(new UserActions.LoginCompleteAction(user));
            })
          );
        }),
        catchError(err => of(new UserActions.LoginFailedAction(err, "AD")))
      );
    })
  );

  @Effect()
  protected login$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.LOGIN),
    map((action: UserActions.LoginAction) => action.form),
    switchMap(form => {
      return this.userSrv.login(form).pipe(
        switchMap(res => {
          const user: User = res["user"];
          return of(new UserActions.LoginCompleteAction(user));
        }),
        catchError(err => {
          if (typeof err === "string") {
            return of(new UserActions.LoginFailedAction(err, "AD"));
          } else {
            err["errSrc"] = "functional";
            return of(new UserActions.ActiveDirLoginAction(form));
          }
        })
      );
    })
  );

  @Effect()
  protected loginFailed$ = this.action$.pipe(
    ofType(UserActions.LOGIN_FAILED),
    map(
      (action: UserActions.LoginFailedAction) =>
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
    map(() => new UserActions.LogoutCompleteAction())
  );

  @Effect({ dispatch: false })
  protected navigate$ = this.action$.pipe(
    ofType(UserActions.LOGOUT_COMPLETE),
    tap(() => this.router.navigate(["/login"]))
  );

  @Effect()
  protected getEmail$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.ACCESS_USER_EMAIL),
    map((action: UserActions.AccessUserEmailAction) => action.userId),
    switchMap(userId => {
      this.userSrv.getCurrent().subscribe(res => {
        console.log("getting current user", res);
        if (res["username"] !== "ingestor") {
          this.userIdentitySrv
            .findOne({ where: { userId: userId } })
            .subscribe(res2 => {
              console.log("getting current user Id", res2);
              console.log("user id email ", res2["profile"]["email"]);
              const userIdentity: UserIdentity = res2 as UserIdentity;
              const xx = new UserActions.RetrieveUserIdentityCompleteAction(
                userIdentity
              );
            });
        } else {
          const xx = new UserActions.AccessUserEmailCompleteAction(
            res["email"]
          );
        }
      });

      return this.userIdentitySrv.findOne({ where: { userId: userId } }).pipe(
        map(
          res2 =>
            new UserActions.AccessUserEmailCompleteAction(
              res2["profile"]["email"]
            )
        ),
        catchError(err => of(new UserActions.AccessUserEmailFailedAction(err)))
      );
    })
  );

  @Effect()
  protected retrieveUser$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.RETRIEVE_USER),
    switchMap(payload => {
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

  @Effect()
  protected retrieveUserIdentity$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.RETRIEVE_USER_IDENTITY),
    switchMap(payload => {
      if (!this.userSrv.isAuthenticated()) {
        return of(
          new UserActions.RetrieveUserFailedAction(
            new Error("No user is logged in")
          )
        );
      }

      return this.userIdentitySrv.findOne({ where: { userId: "sdss" } }).pipe(
        map(res => {
          const userIdentity: UserIdentity = res["userIdentity"];
          return new UserActions.RetrieveUserIdentityCompleteAction(
            userIdentity
          );
        }),
        catchError(err => of(new UserActions.RetrieveUserFailedAction(err)))
      );
    })
  );

  @Effect()
  protected retrieveUserAD$: Observable<Action> = this.action$.pipe(
    ofType(UserActions.AD_LOGIN_COMPLETE),
    switchMap(payload => {
      return this.userSrv.getCurrent().pipe(
        map(res => new UserActions.RetrieveUserCompleteAction(res)),
        catchError(err => of(new UserActions.RetrieveUserFailedAction(err)))
        // Most likely because the user is logged out so not
        // authorised to make a call
      );
    })
  );

  constructor(
    private action$: Actions,
    private store: Store<AppState>,
    private router: Router,
    private accessUserSrv: lb.AccessUserApi,
    private userIdentitySrv: lb.UserIdentityApi,
    private activeDirSrv: ADAuthService,
    private userSrv: lb.UserApi,
    private authSrv: lb.LoopBackAuth
  ) {}
}
