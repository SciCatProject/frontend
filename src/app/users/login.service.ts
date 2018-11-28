import { Injectable } from "@angular/core";
import { map, catchError, concatMap } from "rxjs/operators";
import { of, forkJoin, Observable } from "rxjs";

import { ADAuthService } from "./adauth.service";
import { UserApi, SDKToken, User, LoopBackAuth } from "shared/sdk";
import { UserIdentityApi } from "shared/sdk/services";
import { UserIdentity } from "shared/sdk/models";

export interface SuccessfulLogin {
  user: User;
  accountType: "functional" | "external";
}

@Injectable()
export class LoginService {
  constructor(
    private activeDirSrv: ADAuthService,
    private userSrv: UserApi,
    private UserIdentityApi: UserIdentityApi,
    private authSrv: LoopBackAuth
  ) {}

  public login$(
    username: string,
    password: string,
    rememberMe: boolean
  ): Observable<SuccessfulLogin | null> {
    /* Try both functional login... */
    const funcLogin$ = this.userSrv
      .login({ username, password, rememberMe })
      .pipe(
        map(({ user }) => ({ user, accountType: "functional" })),
        catchError(() => of(null))
      );

    /* ...and AD login */
    const adLogin$ = this.activeDirSrv.login(username, password).pipe(
      concatMap(({ body }) => {
        const token = new SDKToken({
          id: body.access_token,
          userId: body.userId
        });
        this.authSrv.setToken(token);
        return this.userSrv.findById(body.userId).pipe(
          map(user => ({ user, accountType: "external" })),
          catchError(() => of(null))
        );
      }),
      catchError(() => of(null))
    );

    /* Return whichever was found, or null */
    return forkJoin(funcLogin$, adLogin$).pipe(
      map(([funcRes, adRes]) => funcRes || adRes)
    );
  }

  /* fetch the current AD userIdentity for accurate user email*/
  public getUserIdent(id: string): Observable<any> {
    // This is a much more robust way of defining a filter as a string first then parse.
    const filter = JSON.parse('{"where": {"userId":"' + id + '"}}');
    return this.UserIdentityApi.find(filter);
  }
}
