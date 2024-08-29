import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect, concatLatestFrom } from "@ngrx/effects";
import { ADAuthService } from "users/adauth.service";
import {
  LoopBackAuth,
  UserApi,
  UserIdentityApi,
  SDKToken,
  User,
  UserIdentity,
  UserSettingInterface,
} from "shared/sdk";
import { Router } from "@angular/router";
import * as fromActions from "state-management/actions/user.actions";
import {
  map,
  switchMap,
  catchError,
  filter,
  tap,
  distinctUntilChanged,
  mergeMap,
  takeWhile,
} from "rxjs/operators";
import { of } from "rxjs";
import { MessageType } from "state-management/models";
import { Store } from "@ngrx/store";
import {
  selectColumns,
  selectCurrentUser,
} from "state-management/selectors/user.selectors";
import {
  addScientificConditionAction,
  clearDatasetsStateAction,
  setDatasetsLimitFilterAction,
} from "state-management/actions/datasets.actions";
import {
  clearJobsStateAction,
  setJobsLimitFilterAction,
} from "state-management/actions/jobs.actions";
import { clearInstrumentsStateAction } from "state-management/actions/instruments.actions";
import { clearLogbooksStateAction } from "state-management/actions/logbooks.actions";
import { clearPoliciesStateAction } from "state-management/actions/policies.actions";
import { clearProposalsStateAction } from "state-management/actions/proposals.actions";
import { clearPublishedDataStateAction } from "state-management/actions/published-data.actions";
import { clearSamplesStateAction } from "state-management/actions/samples.actions";
import { HttpErrorResponse } from "@angular/common/http";
import { AppConfigService } from "app-config.service";
import {
  loadDefaultSettings,
  selectColumnAction,
} from "state-management/actions/user.actions";
import { ConditionConfig } from "../../shared/modules/filters/filters.module";

@Injectable()
export class UserEffects {
  user$ = this.store.select(selectCurrentUser);
  columns$ = this.store.select(selectColumns);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.loginAction),
      map((action) => action.form),
      map(({ username, password, rememberMe }) =>
        fromActions.activeDirLoginAction({ username, password, rememberMe }),
      ),
    );
  });

  adLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.activeDirLoginAction),
      switchMap(({ username, password, rememberMe }) =>
        this.activeDirAuthService.login(username, password).pipe(
          switchMap(({ body }) => [
            fromActions.activeDirLoginSuccessAction(),
            fromActions.fetchUserAction({ adLoginResponse: body }),
          ]),
          catchError((error: HttpErrorResponse) => {
            return of(fromActions.activeDirLoginFailedAction({ error }));
          }),
        ),
      ),
    );
  });

  oidcFetchUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.loginOIDCAction),
      switchMap(({ oidcLoginResponse }) => {
        const accessTokenPrefix =
          this.configService.getConfig().accessTokenPrefix;
        const token = new SDKToken({
          id: accessTokenPrefix + oidcLoginResponse.accessToken,
          userId: oidcLoginResponse.userId,
          ttl: oidcLoginResponse.ttl,
          created: oidcLoginResponse.created,
        });
        this.loopBackAuth.setToken(token);
        return this.userApi.findById<User>(oidcLoginResponse.userId).pipe(
          switchMap((user: User) => [
            fromActions.fetchUserCompleteAction(),
            fromActions.loginCompleteAction({
              user,
              accountType: "external",
            }),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(fromActions.fetchUserFailedAction({ error })),
          ),
        );
      }),
    );
  });
  fetchUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserAction),
      switchMap(({ adLoginResponse }) => {
        const accessTokenPrefix =
          this.configService.getConfig().accessTokenPrefix;
        const token = new SDKToken({
          id: accessTokenPrefix + adLoginResponse.access_token,
          userId: adLoginResponse.userId,
          ttl: adLoginResponse.ttl,
          created: adLoginResponse.created,
        });
        this.loopBackAuth.setToken(token);
        return this.userApi.findById<User>(adLoginResponse.userId).pipe(
          switchMap((user: User) => [
            fromActions.fetchUserCompleteAction(),
            fromActions.loginCompleteAction({
              user,
              accountType: "external",
            }),
            fromActions.fetchUserIdentityAction({ id: user.id }),
            fromActions.fetchUserSettingsAction({ id: user.id }),
          ]),
          catchError((error: HttpErrorResponse) =>
            of(fromActions.fetchUserFailedAction({ error })),
          ),
        );
      }),
    );
  });

  funcLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.funcLoginAction),
      map((action) => action.form),
      switchMap(({ username, password, rememberMe }) =>
        this.userApi.login({ username, password, rememberMe }).pipe(
          switchMap(({ user }) => [
            fromActions.funcLoginSuccessAction(),
            fromActions.loginCompleteAction({
              user,
              accountType: "functional",
            }),
          ]),
          catchError((error: HttpErrorResponse) => {
            return of(fromActions.funcLoginFailedAction({ error }));
          }),
        ),
      ),
    );
  });

  loginFailed$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchUserFailedAction,
        fromActions.funcLoginFailedAction,
        fromActions.activeDirLoginFailedAction,
      ),
      map((error) => {
        return fromActions.loginFailedAction(error);
      }),
    );
  });

  loginFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.loginFailedAction),
      map(({ error }) => {
        if (error.status === 500) {
          return fromActions.showMessageAction({
            message: {
              content:
                "Unable to connect to the authentication service. Please try again later or contact website maintainer.",
              type: MessageType.Error,
              duration: 5000,
            },
          });
        }
        return fromActions.showMessageAction({
          message: {
            content: "Could not log in. Check your username and password.",
            type: MessageType.Error,
            duration: 5000,
          },
        });
      }),
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.logoutAction),
      filter(() => this.userApi.isAuthenticated()),
      switchMap(() =>
        this.userApi.logout().pipe(
          switchMap(({ logoutURL }) => [
            clearDatasetsStateAction(),
            clearInstrumentsStateAction(),
            clearJobsStateAction(),
            clearLogbooksStateAction(),
            clearPoliciesStateAction(),
            clearProposalsStateAction(),
            clearPublishedDataStateAction(),
            clearSamplesStateAction(),
            fromActions.logoutCompleteAction({ logoutURL }),
          ]),
          catchError(() => of(fromActions.logoutFailedAction())),
        ),
      ),
    );
  });

  logoutNavigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.logoutCompleteAction),
        tap(({ logoutURL }) => {
          if (logoutURL) {
            window.location.href = logoutURL;

            return null;
          } else {
            return this.router.navigate(["/login"]);
          }
        }),
      );
    },
    { dispatch: false },
  );

  fetchCurrentUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCurrentUserAction),
      filter(() => {
        const { created, ttl, id } = this.userApi.getCurrentToken();

        const currentTimeStamp = Math.floor(new Date().getTime());
        const createdTimeStamp = Math.floor(new Date(created).getTime());
        const expirationTimeStamp = +createdTimeStamp + +ttl * 1000;
        const isTokenExpired = currentTimeStamp >= expirationTimeStamp;

        if (id && ttl && isTokenExpired) {
          this.loopBackAuth.clear();
        }

        return this.userApi.isAuthenticated();
      }),
      switchMap(() =>
        this.userApi.getCurrent().pipe(
          switchMap((user) => [
            fromActions.fetchCurrentUserCompleteAction({ user }),
            fromActions.fetchUserIdentityAction({ id: user.id }),
            fromActions.fetchUserSettingsAction({ id: user.id }),
          ]),
          catchError(() => of(fromActions.fetchCurrentUserFailedAction())),
        ),
      ),
    );
  });

  fetchUserIdentity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserIdentityAction),
      switchMap(({ id }) =>
        this.userIdentityApi
          .findOne<UserIdentity>({ where: { userId: id } })
          .pipe(
            map((userIdentity: UserIdentity) =>
              fromActions.fetchUserIdentityCompleteAction({ userIdentity }),
            ),
            catchError(() => of(fromActions.fetchUserIdentityFailedAction())),
          ),
      ),
    );
  });

  fetchUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserSettingsAction),
      switchMap(({ id }) =>
        this.userApi.getSettings(id, null).pipe(
          map((userSettings) =>
            fromActions.fetchUserSettingsCompleteAction({ userSettings }),
          ),
          catchError(() => of(fromActions.fetchUserSettingsFailedAction())),
        ),
      ),
    );
  });

  setLimitFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserSettingsCompleteAction),
      mergeMap(({ userSettings }) => [
        setDatasetsLimitFilterAction({ limit: userSettings.datasetCount }),
        setJobsLimitFilterAction({ limit: userSettings.jobCount }),
      ]),
    );
  });

  setFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserSettingsCompleteAction),
      mergeMap(({ userSettings }) => [
        fromActions.updateFilterConfigs({
          filterConfigs: userSettings.filters,
        }),
      ]),
    );
  });

  setConditions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserSettingsCompleteAction),
      mergeMap(({ userSettings }) => {
        const actions = [];

        userSettings.conditions
          .filter((condition) => condition.enabled)
          .forEach((condition) => {
            actions.push(
              addScientificConditionAction({ condition: condition.condition }),
            );
            actions.push(
              selectColumnAction({
                name: condition.condition.lhs,
                columnType: "custom",
              }),
            );
          });

        actions.push(
          fromActions.updateConditionsConfigs({
            conditionConfigs: userSettings.conditions,
          }),
        );

        return actions;
      }),
    );
  });

  addCustomColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addCustomColumnsAction),
      concatLatestFrom(() => this.columns$),
      distinctUntilChanged(),
      map(() => fromActions.addCustomColumnsCompleteAction()),
    );
  });

  updateUserColumns$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.selectColumnAction,
        fromActions.deselectColumnAction,
        fromActions.deselectAllCustomColumnsAction,
      ),
      concatLatestFrom(() => this.columns$),
      map(([action, columns]) => columns),
      map((columns) =>
        fromActions.updateUserSettingsAction({ property: { columns } }),
      ),
    );
  });

  updateUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateUserSettingsAction),
      concatLatestFrom(() => this.user$),
      takeWhile(([action, user]) => !!user),
      switchMap(([{ property }, user]) =>
        this.userApi.updateSettings(user?.id, property).pipe(
          map((userSettings) =>
            fromActions.updateUserSettingsCompleteAction({ userSettings }),
          ),
          catchError(() => of(fromActions.updateUserSettingsFailedAction())),
        ),
      ),
    );
  });

  fetchScicatToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchScicatTokenAction),
      switchMap(() =>
        of(this.userApi.getCurrentToken()).pipe(
          map((token) => fromActions.fetchScicatTokenCompleteAction({ token })),
          catchError(() => of(fromActions.fetchScicatTokenFailedAction())),
        ),
      ),
    );
  });

  loadDefaultSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadDefaultSettings),
      mergeMap(() =>
        this.userApi.getDefaultSettings().pipe(
          mergeMap((settings: UserSettingInterface) => [
            fromActions.updateConditionsConfigs({
              conditionConfigs: settings.conditions,
            }),
            fromActions.updateFilterConfigs({
              filterConfigs: settings.filters,
            }),
          ]),
          catchError(() => of({ type: "[User] Load Default Settings Failed" })),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private activeDirAuthService: ADAuthService,
    private configService: AppConfigService,
    private loopBackAuth: LoopBackAuth,
    private router: Router,
    private store: Store,
    private userApi: UserApi,
    private userIdentityApi: UserIdentityApi,
  ) {}
}
