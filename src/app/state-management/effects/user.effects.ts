import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { ADAuthService } from "users/adauth.service";
import { AuthService, SDKToken } from "shared/services/auth/auth.service";
import {
  ReturnedUserDto,
  UsersService,
  AuthService as SharedAuthService,
  UserSettings,
  Configuration,
  UserIdentitiesService,
} from "@scicatproject/scicat-sdk-ts-angular";
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
  concatMap,
} from "rxjs/operators";
import { of } from "rxjs";
import {
  ConditionSettingScope,
  MessageType,
  SETTINGS_CONFIG,
} from "state-management/models";
import { Store } from "@ngrx/store";
import {
  selectColumns,
  selectCurrentUser,
  selectConditions,
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
import { initialUserState } from "state-management/state/user.store";

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
      switchMap(({ username, password }) =>
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
        const token = new SDKToken({
          id: oidcLoginResponse.accessToken,
          userId: oidcLoginResponse.userId,
          ttl: oidcLoginResponse.ttl,
          created: oidcLoginResponse.created,
        });
        this.authService.setToken(token);
        this.apiConfigService.accessToken = token.id;
        this.apiConfigService.credentials.bearer = token.id;
        return this.usersService
          .usersControllerFindByIdV3(oidcLoginResponse.userId)
          .pipe(
            switchMap((user: ReturnedUserDto) => [
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
        const token = new SDKToken({
          id: adLoginResponse.access_token,
          userId: adLoginResponse.userId,
          ttl: adLoginResponse.ttl,
          created: adLoginResponse.created,
        });
        this.authService.setToken(token);
        this.apiConfigService.accessToken = token.id;
        this.apiConfigService.credentials.bearer = token.id;
        return this.usersService
          .usersControllerFindByIdV3(adLoginResponse.userId)
          .pipe(
            switchMap((user: ReturnedUserDto) => [
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
        this.sharedAuthService
          .authControllerLoginV3({ username, password })
          .pipe(
            switchMap((loginResponse) => {
              this.apiConfigService.accessToken = loginResponse.access_token;
              this.apiConfigService.credentials.bearer =
                loginResponse.access_token;
              this.authService.setToken({
                ...loginResponse,
                rememberMe,
                scopes: null,
              });
              return [
                fromActions.funcLoginSuccessAction(),
                fromActions.loginCompleteAction({
                  user: loginResponse.user,
                  accountType: "functional",
                }),
              ];
            }),
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
      filter(() => this.authService.isAuthenticated()),
      switchMap(() => {
        this.authService.clear();
        return this.sharedAuthService.authControllerLogoutV3().pipe(
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
        );
      }),
    );
  });

  logoutNavigate$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(fromActions.logoutCompleteAction),
        tap(({ logoutURL }) => {
          this.apiConfigService.accessToken = null;
          this.apiConfigService.credentials.bearer = null;
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
        const { created, ttl, id } = this.authService.getToken();

        const currentTimeStamp = Math.floor(new Date().getTime());
        const createdTimeStamp = Math.floor(new Date(created).getTime());
        const expirationTimeStamp = +createdTimeStamp + +ttl * 1000;
        const isTokenExpired = currentTimeStamp >= expirationTimeStamp;

        if (id && ttl && isTokenExpired) {
          this.authService.clear();
          this.apiConfigService.accessToken = null;
          this.apiConfigService.credentials.bearer = null;
          if (!(window as any).__karma__) {
            window.location.reload();
          }
        }

        return this.authService.isAuthenticated();
      }),
      switchMap(() =>
        this.usersService.usersControllerGetMyUserV3().pipe(
          switchMap((user: ReturnedUserDto) => [
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
        this.userIdentityService
          .userIdentitiesControllerFindOneV3(
            JSON.stringify({
              where: { userId: id },
            }),
          )
          .pipe(
            map((userIdentity) =>
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
        this.usersService.usersControllerGetSettingsV3(id, null).pipe(
          map((userSettings: UserSettings) => {
            const config = this.configService.getConfig();
            const externalSettings = {
              ...(userSettings.externalSettings || {}),
            };

            const settingsToCheck = SETTINGS_CONFIG.map((s) => s.key);

            for (const setting of settingsToCheck) {
              let items = externalSettings[setting];

              if (!Array.isArray(items) || items.length < 1) {
                const settingConfig = SETTINGS_CONFIG.find(
                  (s) => s.key === setting,
                );
                switch (settingConfig?.scope) {
                  case "dataset":
                    items =
                      config.defaultDatasetsListSettings?.[
                        settingConfig.configKey
                      ] || initialUserState.settings[setting];
                    break;
                  case "proposal":
                    items =
                      config.defaultProposalsListSettings?.[
                        settingConfig.configKey
                      ] || initialUserState.settings[setting];
                    break;
                  default:
                    items = initialUserState.settings[setting] || [];
                }
              }
              externalSettings[setting] = items;
            }

            const normalizedUserSettings = {
              ...userSettings,
              externalSettings,
            };

            return fromActions.fetchUserSettingsCompleteAction({
              userSettings: normalizedUserSettings,
            });
          }),
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
      mergeMap(({ userSettings }) =>
        SETTINGS_CONFIG.filter((s) => s.configKey === "filters").map((s) =>
          fromActions.updateFilterConfigs({
            filterConfigs: userSettings.externalSettings?.[s.key] || [],
            scope: s.scope as "dataset" | "proposal",
          }),
        ),
      ),
    );
  });

  setConditions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchUserSettingsCompleteAction),
      mergeMap(({ userSettings }) =>
        SETTINGS_CONFIG.filter((s) => s.configKey === "conditions").flatMap(
          (s) => {
            const scope = s.scope as ConditionSettingScope;
            const incoming = userSettings.externalSettings?.[s.key];

            const conditions = incoming.length > 0 ? incoming : [];

            const actions = [];

            if (scope === "dataset") {
              // TODO: Check with the types here. This is working better as it is now with the conditions and filters. We are leaving it for now as it was from before.
              conditions
                .filter((c) => c.enabled)
                .forEach((c) => {
                  actions.push(
                    addScientificConditionAction({ condition: c.condition }),
                  );
                });
            }

            actions.push(
              fromActions.updateConditionsConfigs({
                conditionConfigs: conditions,
                scope,
              }),
            );

            return actions;
          },
        ),
      ),
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
      ofType(fromActions.selectColumnAction, fromActions.deselectColumnAction),
      concatLatestFrom(() => this.columns$),
      map(([action, columns]) => columns),
      distinctUntilChanged(
        (prevColumns, currColumns) =>
          JSON.stringify(prevColumns) === JSON.stringify(currColumns),
      ),
      map((columns) =>
        fromActions.updateUserSettingsAction({
          property: { fe_dataset_table_columns: columns },
        }),
      ),
    );
  });

  updateUserSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateUserSettingsAction),
      concatLatestFrom(() => [this.user$]),
      takeWhile(([action, user]) => !!user),
      switchMap(([{ property }, user]) => {
        const settingsToNest = SETTINGS_CONFIG.map((s) => s.key);
        const propertyKeys = Object.keys(property);
        const newProperty = {};
        let useExternalSettings = false;

        propertyKeys.forEach((key) => {
          if (settingsToNest.includes(key)) {
            useExternalSettings = true;
          }
          newProperty[key] = property[key];
        });

        // NOTE:
        // - datasetCount and jobCount are updated using the partialUpdateSettings API,
        //   which applies validation according to the updateSettingsDTO rules.
        // - All other properties (like columns, conditions, and filters) are updated
        //   using the partialUpdateExternalSettings API, which does not enforce validation.

        const apiCall$ = useExternalSettings
          ? this.usersService.usersControllerPatchExternalSettingsV3(
              user?.id,
              JSON.stringify(newProperty) as any,
            )
          : this.usersService.usersControllerPatchSettingsV3(
              user?.id,
              JSON.stringify(newProperty) as any,
            );
        return apiCall$.pipe(
          map((userSettings: UserSettings) =>
            fromActions.updateUserSettingsCompleteAction({
              userSettings,
            }),
          ),

          catchError(() => of(fromActions.updateUserSettingsFailedAction())),
        );
      }),
    );
  });

  fetchScicatToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchScicatTokenAction),
      switchMap(() =>
        of(this.authService.getToken()).pipe(
          map((token) => fromActions.fetchScicatTokenCompleteAction({ token })),
          catchError(() => of(fromActions.fetchScicatTokenFailedAction())),
        ),
      ),
    );
  });

  loadDefaultSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.loadDefaultSettings),
      concatLatestFrom(() => this.store.select(selectConditions("dataset"))),
      map(([{ config }, existingDatasetConditions]) => {
        const isAuthenticated = this.authService.isAuthenticated();
        const actions = [];

        actions.push(
          fromActions.updateHasFetchedSettings({
            hasFetchedSettings: !isAuthenticated,
          }),
        );

        SETTINGS_CONFIG.filter((s) => s.configKey === "filters").forEach(
          (s) => {
            let filterConfigs;

            switch (s.scope) {
              case "dataset":
                filterConfigs =
                  config.defaultDatasetsListSettings?.filters ||
                  initialUserState.settings.fe_dataset_table_filters;
                break;
              case "proposal":
                filterConfigs =
                  config.defaultProposalsListSettings?.filters ||
                  initialUserState.settings.fe_proposal_table_filters;
                break;
              default:
                filterConfigs = initialUserState.settings[s.key];
                break;
            }

            actions.push(
              fromActions.updateFilterConfigs({
                filterConfigs,
                scope: s.scope as "dataset" | "proposal",
              }),
            );
          },
        );

        SETTINGS_CONFIG.filter((s) => s.configKey === "conditions").forEach(
          (s) => {
            const scope = s.scope as ConditionSettingScope;
            let defaultConditions;

            switch (scope) {
              case "dataset":
                defaultConditions =
                  config.defaultDatasetsListSettings?.conditions ||
                  initialUserState.settings.fe_dataset_table_conditions;
                break;
              case "sample":
                defaultConditions =
                  initialUserState.settings.fe_sample_table_conditions;
                break;
              default:
                defaultConditions = initialUserState.settings[s.key];
                break;
            }

            const conditionConfigs =
              scope === "dataset" && existingDatasetConditions?.length
                ? existingDatasetConditions
                : defaultConditions;

            actions.push(
              fromActions.updateConditionsConfigs({
                conditionConfigs,
                scope,
              }),
            );
          },
        );

        SETTINGS_CONFIG.filter((s) => s.configKey === "columns").forEach(
          (s) => {
            let columnsConfig = [];

            // NOTE: config.localColumns is for backward compatibility.
            //       it should be removed once no longer needed

            switch (s.scope) {
              case "dataset":
                columnsConfig =
                  config.defaultDatasetsListSettings?.columns ||
                  config.localColumns ||
                  initialUserState.settings.fe_dataset_table_columns;
                break;
              case "proposal":
                columnsConfig =
                  config.defaultProposalsListSettings?.columns ||
                  initialUserState.settings.fe_proposal_table_columns;
                break;
              default:
                columnsConfig = initialUserState.settings[s.key];
                break;
            }

            actions.push(
              fromActions.setTableColumnsAction({
                columns: columnsConfig,
                scope: s.scope as
                  | "dataset"
                  | "proposal"
                  | "sample"
                  | "instrument"
                  | "file",
              }),
            );
          },
        );

        return actions;
      }),
      concatMap((actions) => actions),
    );
  });

  constructor(
    private actions$: Actions,
    private activeDirAuthService: ADAuthService,
    private configService: AppConfigService,
    private apiConfigService: Configuration,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private usersService: UsersService,
    private sharedAuthService: SharedAuthService,
    private userIdentityService: UserIdentitiesService,
  ) {}
}
