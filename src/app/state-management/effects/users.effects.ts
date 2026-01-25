import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import {
  loadUsers,
  loadUsersFailure,
  loadUsersSuccess,
} from "state-management/actions/users.actions";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { AuthService } from "shared/services/auth/auth.service";

@Injectable()
export class UsersEffects {
  private baseUrl = this.appConfigService.getConfig().lbBaseURL;

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.authService.getAccessTokenId()}`,
        });
        return this.http
          .get<ReturnedUserDto[]>(`${this.baseUrl}/api/v3/users`, { headers })
          .pipe(
            map((users) => loadUsersSuccess({ users })),
            catchError((error) => of(loadUsersFailure({ error }))),
          );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private authService: AuthService,
  ) {}
}
