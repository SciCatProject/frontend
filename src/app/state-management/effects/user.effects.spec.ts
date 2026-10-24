import { UserEffects } from "./user.effects";
import {
  UsersService,
  UserIdentitiesService,
  UserIdentity,
  ReturnedUserDto,
  UserSettings,
  Configuration,
  AuthService as SharedAuthService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { ADAuthService } from "users/adauth.service";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import * as fromActions from "state-management/actions/user.actions";
import { hot, cold, getTestScheduler } from "jasmine-marbles";
import { toArray } from "rxjs/operators";
import { MessageType } from "state-management/models";
import { Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  selectColumns,
  selectCurrentUser,
} from "state-management/selectors/user.selectors";
import {
  clearDatasetsStateAction,
  setDatasetsLimitFilterAction,
  setScientificConditionsAction,
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
import { Type } from "@angular/core";
import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AppConfigService } from "app-config.service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthService, SDKToken } from "shared/services/auth/auth.service";
import { TestObservable } from "jasmine-marbles/src/test-observables";
import { mockUser } from "shared/MockStubs";

class AppConfigServiceMock {
  getConfig() {
    return {
      accessTokenPrefix: "",
      defaultDatasetsListSettings: {
        columns: [],
        conditions: [],
        filters: [],
      },
      defaultProposalsListSettings: {
        columns: [],
        filters: [],
      },
    };
  }
}

describe("UserEffects", () => {
  let actions: TestObservable;
  let effects: UserEffects;
  let activeDirAuthService: jasmine.SpyObj<ADAuthService>;
  let authService: jasmine.SpyObj<AuthService>;
  let userApi: jasmine.SpyObj<UsersService>;
  let sharedAuthService: jasmine.SpyObj<SharedAuthService>;
  let userIdentityApi: jasmine.SpyObj<UserIdentitiesService>;
  let router: jasmine.SpyObj<Router>;
  const error = new HttpErrorResponse({});
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UserEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: selectCurrentUser, value: {} },
            { selector: selectColumns, value: [] },
          ],
        }),
        {
          provide: AppConfigService,
          useClass: AppConfigServiceMock,
        },
        {
          provide: Configuration,
          useClass: Configuration,
        },
        {
          provide: ADAuthService,
          useValue: jasmine.createSpyObj("activeDirAuthService", ["login"]),
        },
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj("authService", [
            "setToken",
            "clear",
            "isAuthenticated",
            "getCurrentUserData",
            "getCurrentUserId",
            "getToken",
          ]),
        },
        {
          provide: SharedAuthService,
          useValue: jasmine.createSpyObj("sharedAuthService", [
            "authControllerLoginV3",
            "authControllerLogoutV3",
          ]),
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj("userApi", [
            "usersControllerFindByIdV3",
            "usersControllerGetSettingsV3",
            "usersControllerPatchExternalSettingsV3",
            "usersControllerGetMyUserV3",
          ]),
        },
        {
          provide: UserIdentitiesService,
          useValue: jasmine.createSpyObj("userIdentityApi", [
            "userIdentitiesControllerFindOneV3",
          ]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj("router", ["navigate"]),
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    effects = TestBed.inject(UserEffects);
    activeDirAuthService = injectedStub(ADAuthService);
    authService = injectedStub(AuthService);
    sharedAuthService = injectedStub(SharedAuthService);
    userApi = injectedStub(UsersService);
    userIdentityApi = injectedStub(UserIdentitiesService);
    router = injectedStub(Router);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("login$", () => {
    it("should redirect loginAction to activeDirLoginAction", () => {
      const form = {
        username: "test",
        password: "test",
        rememberMe: true,
      };
      const action = fromActions.loginAction({ form });
      const outcome = fromActions.activeDirLoginAction({
        username: form.username,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe("adLogin$", () => {
    const username = "test";
    const password = "test";
    const rememberMe = true;

    it("should result in an activeDirLoginSuccessAction and a fetchUserAction", () => {
      const loginRes = {
        body: {
          access_token: "testToken",
          userId: "testId",
        },
      };
      const action = fromActions.activeDirLoginAction({
        username,
        password,
        rememberMe,
      });
      const outcome1 = fromActions.activeDirLoginSuccessAction();
      const outcome2 = fromActions.fetchUserAction({
        adLoginResponse: loginRes.body,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: loginRes });
      activeDirAuthService.login.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.adLogin$).toBeObservable(expected);
    });

    it("should result in an activeDirLoginFailedAction", () => {
      const action = fromActions.activeDirLoginAction({
        username,
        password,
        rememberMe,
      });
      const outcome = fromActions.activeDirLoginFailedAction({ error });

      actions = hot("-a", { a: action });
      const response = cold("-#", {}, error);
      activeDirAuthService.login.and.returnValue(response);

      const expected = cold("--b", { b: outcome });

      expect(effects.adLogin$).toBeObservable(expected);
    });
  });

  describe("fetchUser$", () => {
    const adLoginResponse = {};
    const token = new SDKToken({
      id: "testId",
      userId: "testId",
    });

    it("should result in a fetchUserCompleteAction, loginCompleteAction, fetchUserIdentityAction and a fetchUserSettingsAction", () => {
      const user = mockUser;
      user.id = "testId";
      const accountType = "external";
      const action = fromActions.fetchUserAction({ adLoginResponse });
      const outcome1 = fromActions.fetchUserCompleteAction();
      const outcome2 = fromActions.loginCompleteAction({ user, accountType });
      const outcome3 = fromActions.fetchUserIdentityAction({ id: user.id });
      const outcome4 = fromActions.fetchUserSettingsAction({ id: user.id });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: user });
      authService.setToken(token);
      userApi.usersControllerFindByIdV3.and.returnValue(response);

      const expected = cold("--(bcde)", {
        b: outcome1,
        c: outcome2,
        d: outcome3,
        e: outcome4,
      });
      expect(effects.fetchUser$).toBeObservable(expected);
    });

    it("should result in a fetchUserFailedAction", () => {
      const action = fromActions.fetchUserAction({ adLoginResponse });
      const outcome = fromActions.fetchUserFailedAction({ error });

      actions = hot("-a", { a: action });
      const response = cold("-#", {}, error);
      authService.setToken(token);
      userApi.usersControllerFindByIdV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUser$).toBeObservable(expected);
    });
  });

  describe("oidcFetchUser$", () => {
    const oidcLoginResponse = {};
    const token = new SDKToken({
      id: "testId",
      userId: "testId",
    });

    it("should result in a fetchUserCompleteAction and a loginCompleteAction", () => {
      let user: ReturnedUserDto;
      const accountType = "external";
      const action = fromActions.loginOIDCAction({ oidcLoginResponse });
      const outcome1 = fromActions.fetchUserCompleteAction();
      const outcome2 = fromActions.loginCompleteAction({ user, accountType });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: user });
      authService.setToken(token);
      userApi.usersControllerFindByIdV3.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.oidcFetchUser$).toBeObservable(expected);
    });

    it("should result in a fetchUserFailedAction", () => {
      const action = fromActions.loginOIDCAction({ oidcLoginResponse });
      const outcome = fromActions.fetchUserFailedAction({ error });

      actions = hot("-a", { a: action });
      const response = cold("-#", {}, error);
      authService.setToken(token);
      userApi.usersControllerFindByIdV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.oidcFetchUser$).toBeObservable(expected);
    });
  });

  describe("funcLogin$", () => {
    const form = {
      username: "test",
      password: "test",
      rememberMe: true,
      error: new HttpErrorResponse({
        status: 400,
        statusText: "Bad Request",
      }),
    };

    it("should result in a funcLoginSuccessAction and a loginCompleteAction", () => {
      const user = mockUser;
      const accountType = "functional";
      const action = fromActions.funcLoginAction({ form });
      const outcome1 = fromActions.funcLoginSuccessAction();
      const outcome2 = fromActions.loginCompleteAction({ user, accountType });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { user } });
      sharedAuthService.authControllerLoginV3.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.funcLogin$).toBeObservable(expected);
    });

    it("should result in a funcLoginFailedAction", () => {
      const action = fromActions.funcLoginAction({ form });
      const outcome = fromActions.funcLoginFailedAction({ error });

      actions = hot("-a", { a: action });
      const response = cold("-#", {}, error);
      sharedAuthService.authControllerLoginV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.funcLogin$).toBeObservable(expected);
    });
  });

  describe("loginFailed$", () => {
    describe("ofType fetchUserFailedAction", () => {
      it("should result in a loginFailedAction", () => {
        const action = fromActions.fetchUserFailedAction({ error });
        const outcome = fromActions.loginFailedAction({ error });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loginFailed$).toBeObservable(expected);
      });
    });

    describe("ofType funcLoginFailedAction", () => {
      it("should result in a loginFailedAction", () => {
        const action = fromActions.funcLoginFailedAction({ error });
        const outcome = fromActions.loginFailedAction({ error });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loginFailed$).toBeObservable(expected);
      });
    });
  });

  describe("loginFailedMessage$", () => {
    it("should result in a showMessageAction", () => {
      const message = {
        type: MessageType.Error,
        content: "Could not log in. Check your username and password.",
        duration: 5000,
      };
      const action = fromActions.loginFailedAction({
        error: new HttpErrorResponse({ status: 401 }),
      });
      const outcome = fromActions.showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.loginFailedMessage$).toBeObservable(expected);
    });
    it("should result in a showMessageAction Failed to connect to AD", () => {
      const message = {
        type: MessageType.Error,
        content:
          "Unable to connect to the authentication service. Please try again later or contact website maintainer.",
        duration: 5000,
      };
      const action = fromActions.loginFailedAction({
        error: new HttpErrorResponse({ status: 500 }),
      });
      const outcome = fromActions.showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.loginFailedMessage$).toBeObservable(expected);
    });
  });

  describe("logout$", () => {
    it("should result in clear[...]StateAction for all models and logoutCompleteAction", () => {
      const action = fromActions.logoutAction();
      const outcome1 = clearDatasetsStateAction();
      const outcome2 = clearInstrumentsStateAction();
      const outcome3 = clearJobsStateAction();
      const outcome4 = clearLogbooksStateAction();
      const outcome5 = clearPoliciesStateAction();
      const outcome6 = clearProposalsStateAction();
      const outcome7 = clearPublishedDataStateAction();
      const outcome8 = clearSamplesStateAction();
      const outcome9 = fromActions.logoutCompleteAction({ logoutURL: "" });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { logoutURL: "" } });
      authService.isAuthenticated.and.returnValue(true);
      sharedAuthService.authControllerLogoutV3.and.returnValue(response);

      const expected = cold("--(bcdefghij)", {
        b: outcome1,
        c: outcome2,
        d: outcome3,
        e: outcome4,
        f: outcome5,
        g: outcome6,
        h: outcome7,
        i: outcome8,
        j: outcome9,
      });
      expect(effects.logout$).toBeObservable(expected);
    });

    it("should result in a logoutFailedAction", () => {
      const action = fromActions.logoutAction();
      const outcome = fromActions.logoutFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      authService.isAuthenticated.and.returnValue(true);
      sharedAuthService.authControllerLogoutV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.logout$).toBeObservable(expected);
    });
  });

  describe("logoutNavigate$", () => {
    it("should navigate to anonymous view", () => {
      const action = fromActions.logoutCompleteAction({});

      actions = hot("-a", { a: action });

      expect(effects.logoutNavigate$).toBeObservable(actions);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });
  });

  describe("fetchCurrentUser$", () => {
    it("should result in a fetchCurrentUserCompleteAction, a fetchUserIdentityAction, and a fetchUserSettingsAction", () => {
      const user = mockUser;
      user.id = "testId";
      const token = {
        id: "testId",
        ttl: 100,
        scopes: ["string"],
        created: new Date().toISOString(),
        userId: "testId",
        user: "testUser",
        rememberMe: false,
      } as unknown as SDKToken;
      const action = fromActions.fetchCurrentUserAction();
      const outcome1 = fromActions.fetchCurrentUserCompleteAction({ user });
      const outcome2 = fromActions.fetchUserIdentityAction({ id: user.id });
      const outcome3 = fromActions.fetchUserSettingsAction({ id: user.id });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: user });
      authService.getToken.and.returnValue(token);
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUserId.and.returnValue(user.id);
      userApi.usersControllerGetMyUserV3.and.returnValue(response);

      const expected = cold("--(bcd)", {
        b: outcome1,
        c: outcome2,
        d: outcome3,
      });
      expect(effects.fetchCurrentUser$).toBeObservable(expected);
    });

    it("should result in a fetchCurrentUserFailedAction", () => {
      const user = mockUser;
      user.id = "testId";
      const token = {
        id: "testId",
        ttl: 3600,
        scopes: ["string"],
        created: new Date().toISOString(),
        userId: "testId",
        user: "testUser",
      } as unknown as SDKToken;
      const action = fromActions.fetchCurrentUserAction();
      const outcome = fromActions.fetchCurrentUserFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      authService.getToken.and.returnValue(token);
      authService.isAuthenticated.and.returnValue(true);
      authService.getCurrentUserId.and.returnValue(user.id);
      userApi.usersControllerGetMyUserV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCurrentUser$).toBeObservable(expected);
    });

    it("should not call getCurrent() if token is expired", () => {
      const user = mockUser;
      user.id = "testId";
      const token = {
        id: "testId",
        ttl: 100,
        scopes: ["string"],
        created: new Date(1611438651).toISOString(),
        userId: "testId",
        user: "testUser",
      } as unknown as SDKToken;
      const action = fromActions.fetchCurrentUserAction();

      actions = hot("-a", { a: action });
      authService.getToken.and.returnValue(token);
      authService.isAuthenticated.and.returnValue(false);

      const expected = cold("");

      expect(effects.fetchCurrentUser$).toBeObservable(expected);
      expect(authService.getCurrentUserData).not.toHaveBeenCalled();
    });
  });

  describe("fetchUserIdentity$", () => {
    it("should result in a fetchUserIdentityCompleteAction", () => {
      const id = "testId";
      const userIdentity: UserIdentity = {
        authStrategy: "",
        created: "",
        credentials: {},
        externalId: "",
        modified: "",
        profile: {
          accessGroups: [],
          displayName: "",
          email: "",
          emails: [],
          id: "testId",
          oidcClaims: [],
          thumbnailPhoto: "",
          username: "",
        },
        provider: "",
        userId: "testId",
      };
      const action = fromActions.fetchUserIdentityAction({ id });
      const outcome = fromActions.fetchUserIdentityCompleteAction({
        userIdentity,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: userIdentity });
      userIdentityApi.userIdentitiesControllerFindOneV3.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserIdentity$).toBeObservable(expected);
    });

    it("should result in a fetchUserIdentityFailedAction", () => {
      const id = "testId";
      const action = fromActions.fetchUserIdentityAction({ id });
      const outcome = fromActions.fetchUserIdentityFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userIdentityApi.userIdentitiesControllerFindOneV3.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserIdentity$).toBeObservable(expected);
    });
  });

  describe("fetchUserSettings$", () => {
    const id = "testId";

    it("should result in a fetchUserSettingsCompleteAction", () => {
      const userSettings = {
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
      } as unknown as UserSettings;

      const normalizedUserSettings = {
        ...userSettings,
        externalSettings: {
          fe_dataset_table_columns: [],
          fe_dataset_table_conditions: [],
          fe_dataset_table_filters: [],
          fe_proposal_table_columns: [],
          fe_proposal_table_filters: [],
          fe_sample_table_columns: [],
          fe_sample_table_conditions: [],
          fe_instrument_table_columns: [],
          fe_file_table_columns: [],
          fe_job_table_columns: [],
          fe_publisheddata_table_columns: [],
        },
      } as unknown as UserSettings;
      const action = fromActions.fetchUserSettingsAction({ id });
      const outcome = fromActions.fetchUserSettingsCompleteAction({
        userSettings: normalizedUserSettings,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: userSettings });
      userApi.usersControllerGetSettingsV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserSettings$).toBeObservable(expected);
    });

    describe("predefined conditions of the samples", () => {
      const predefined = {
        condition: {
          lhs: "material",
          relation: "EQUAL_TO_STRING" as const,
          rhs: "steel",
          unit: "",
        },
      };

      const settingsAfterFetch = (externalSettings: object) => {
        spyOn(TestBed.inject(AppConfigService), "getConfig").and.returnValue({
          defaultSamplesListSettings: { conditions: [predefined] },
        } as never);
        actions = hot("-a", { a: fromActions.fetchUserSettingsAction({ id }) });
        userApi.usersControllerGetSettingsV3.and.returnValue(
          cold("-a|", { a: { externalSettings } as unknown as UserSettings }),
        );

        let settings: Record<string, unknown>;
        effects.fetchUserSettings$.subscribe((action) => {
          settings = (action as { userSettings: UserSettings }).userSettings
            .externalSettings;
        });
        getTestScheduler().flush();
        return settings;
      };

      it("should be the sample conditions of a user that has none", () => {
        expect(
          settingsAfterFetch({ fe_sample_table_conditions: [] })
            .fe_sample_table_conditions,
        ).toEqual([predefined]);
      });

      it("should be the sample conditions of a user whose settings are new", () => {
        expect(settingsAfterFetch({}).fe_sample_table_conditions).toEqual([
          predefined,
        ]);
      });

      it("should not replace the sample conditions the user has", () => {
        const own = [{ condition: { ...predefined.condition, lhs: "own" } }];

        expect(
          settingsAfterFetch({ fe_sample_table_conditions: own })
            .fe_sample_table_conditions,
        ).toEqual(own);
      });

      it("should leave the dataset conditions alone", () => {
        expect(settingsAfterFetch({}).fe_dataset_table_conditions).toEqual([]);
      });
    });

    it("should result in a fetchUserSettingsFailedAction", () => {
      const action = fromActions.fetchUserSettingsAction({ id });
      const outcome = fromActions.fetchUserSettingsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.usersControllerGetSettingsV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserSettings$).toBeObservable(expected);
    });
  });

  describe("setLimitFilters$", () => {
    it("should result in a setDatasetsLimitFilterAction and a setJobsLimitFilterAction", () => {
      const userSettings = {
        datasetCount: 10,
        jobCount: 10,
      } as unknown as UserSettings;

      const action = fromActions.fetchUserSettingsCompleteAction({
        userSettings,
      });
      const outcome1 = setDatasetsLimitFilterAction({
        limit: userSettings.datasetCount,
      });
      const outcome2 = setJobsLimitFilterAction({
        limit: userSettings.jobCount,
      });

      actions = hot("-a", { a: action });

      const expected = cold("-(bc)", { b: outcome1, c: outcome2 });
      expect(effects.setLimitFilters$).toBeObservable(expected);
    });
  });

  describe("loadDefaultSettings$", () => {
    const predefined = (lhs: string) => ({
      condition: {
        lhs,
        relation: "EQUAL_TO_STRING" as const,
        rhs: "steel",
        unit: "",
      },
    });
    const noSettings = {
      fe_dataset_table_conditions: [],
      fe_sample_table_conditions: [],
    };

    // the conditions that are put in the store, by scope
    const loaded = (config: object, settings: object = noSettings) => {
      TestBed.inject(MockStore).setState({ users: { settings } });
      actions = hot("(a|)", {
        a: fromActions.loadDefaultSettings({ config } as never),
      });

      let emitted: {
        type: string;
        scope?: string;
        conditionConfigs?: unknown;
      }[];
      effects.loadDefaultSettings$
        .pipe(toArray())
        .subscribe((all) => (emitted = all as typeof emitted));
      getTestScheduler().flush();

      const conditionsOf = (scope: string) =>
        emitted.find(
          (action) =>
            action.type === fromActions.updateConditionsConfigs.type &&
            action.scope === scope,
        )?.conditionConfigs;
      return {
        dataset: conditionsOf("dataset"),
        sample: conditionsOf("sample"),
      };
    };

    it("should start the dataset list with the predefined conditions", () => {
      const conditions = [predefined("material")];

      const { dataset } = loaded({
        defaultDatasetsListSettings: { conditions },
      });

      expect(dataset).toEqual(conditions);
    });

    it("should start the sample list with the predefined conditions", () => {
      const conditions = [predefined("material")];

      const { sample, dataset } = loaded({
        defaultSamplesListSettings: { conditions },
      });

      expect(sample).toEqual(conditions);
      expect(dataset).toEqual([]);
    });

    it("should keep the predefined conditions of the datasets and the samples apart", () => {
      const datasets = [predefined("temperature")];
      const samples = [predefined("material")];

      const { dataset, sample } = loaded({
        defaultDatasetsListSettings: { conditions: datasets },
        defaultSamplesListSettings: { conditions: samples },
      });

      expect(dataset).toEqual(datasets);
      expect(sample).toEqual(samples);
    });

    it("should start without conditions when nothing is predefined", () => {
      const { dataset, sample } = loaded({});

      expect(dataset).toEqual([]);
      expect(sample).toEqual([]);
    });

    it("should keep the conditions the user has instead of the predefined ones", () => {
      const own = [predefined("own_key")];

      const { dataset, sample } = loaded(
        {
          defaultDatasetsListSettings: { conditions: [predefined("a")] },
          defaultSamplesListSettings: { conditions: [predefined("b")] },
        },
        {
          fe_dataset_table_conditions: own,
          fe_sample_table_conditions: own,
        },
      );

      expect(dataset).toEqual(own);
      expect(sample).toEqual(own);
    });

    it("should filter the datasets by the predefined conditions that are not switched off", () => {
      const conditions = [
        predefined("on"),
        { ...predefined("off"), enabled: false },
      ];
      TestBed.inject(MockStore).setState({ users: { settings: noSettings } });
      actions = hot("(a|)", {
        a: fromActions.loadDefaultSettings({
          config: { defaultDatasetsListSettings: { conditions } },
        } as never),
      });

      let filtered: unknown;
      effects.loadDefaultSettings$.pipe(toArray()).subscribe((all) => {
        filtered = (
          all.find(
            (action) => action.type === setScientificConditionsAction.type,
          ) as ReturnType<typeof setScientificConditionsAction>
        ).conditions;
      });

      getTestScheduler().flush();

      expect(filtered).toEqual([predefined("on").condition]);
    });
  });

  describe("setConditions$", () => {
    const filled = {
      condition: {
        lhs: "temperature",
        relation: "EQUAL_TO" as const,
        rhs: "20",
        unit: "",
      },
      enabled: true,
    };
    const switchedOff = { ...filled, enabled: false };
    const withoutValue = {
      ...filled,
      condition: { ...filled.condition, lhs: "pressure", rhs: "" },
    };

    it("should filter datasets by the enabled conditions that have a value", () => {
      const configs = [filled, switchedOff, withoutValue];
      const userSettings = {
        externalSettings: {
          fe_dataset_table_conditions: configs,
          fe_sample_table_conditions: [],
        },
      } as unknown as UserSettings;

      actions = hot("-a", {
        a: fromActions.fetchUserSettingsCompleteAction({ userSettings }),
      });

      const expected = cold("-(bcd)", {
        b: setScientificConditionsAction({
          conditions: [
            {
              lhs: "temperature",
              relation: "EQUAL_TO_NUMERIC",
              rhs: 20,
              unit: "",
            },
          ],
        }),
        c: fromActions.updateConditionsConfigs({
          conditionConfigs: configs,
          scope: "dataset",
        }),
        d: fromActions.updateConditionsConfigs({
          conditionConfigs: [],
          scope: "sample",
        }),
      });
      expect(effects.setConditions$).toBeObservable(expected);
    });
  });

  describe("addCustomColumns$", () => {
    it("should result in an addCustomColumnsCompleteAction", () => {
      const names = ["test"];
      const action = fromActions.addCustomColumnsAction({
        names,
        scope: "dataset",
      });
      const outcome = fromActions.addCustomColumnsCompleteAction();

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.addCustomColumns$).toBeObservable(expected);
    });
  });

  describe("updateUserColumns$", () => {
    const property = { fe_dataset_table_columns: [] };
    describe("ofType selectColumnAction", () => {
      it("should dispatch an updateUserSettingsAction", () => {
        const name = "test";
        const columnType = "standard";
        const action = fromActions.selectColumnAction({
          name,
          columnType,
          scope: "dataset",
        });
        const outcome = fromActions.updateUserSettingsAction({ property });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateUserColumns$).toBeObservable(expected);
      });
    });

    describe("ofType deselectColumnAction", () => {
      it("should dispatch an updateUserSettingsAction", () => {
        const name = "test";
        const columnType = "standard";
        const action = fromActions.deselectColumnAction({
          name,
          columnType,
          scope: "dataset",
        });
        const outcome = fromActions.updateUserSettingsAction({ property });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateUserColumns$).toBeObservable(expected);
      });
    });
  });

  describe("updateUserSettings$", () => {
    const property = { fe_dataset_table_columns: [] };

    it("should result in an updateUserSettingsCompleteAction", () => {
      // TODO: try to fix the types here instead of using type casting and conversion
      const userSettings = {
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
        externalSettings: {
          fe_dataset_table_columns: [],
          fe_dataset_table_filters: [],
          fe_dataset_table_conditions: [],
        },
      } as unknown as UserSettings;

      const apiResponse = {
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
        externalSettings: {
          fe_dataset_table_columns: [],
          fe_dataset_table_filters: [],
          fe_dataset_table_conditions: [],
        },
      };
      const action = fromActions.updateUserSettingsAction({ property });
      const outcome = fromActions.updateUserSettingsCompleteAction({
        userSettings,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: apiResponse });
      userApi.usersControllerPatchExternalSettingsV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateUserSettings$).toBeObservable(expected);
    });

    it("should result in an updateUserSettingsFailedAction", () => {
      const action = fromActions.updateUserSettingsAction({ property });
      const outcome = fromActions.updateUserSettingsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.usersControllerPatchExternalSettingsV3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateUserSettings$).toBeObservable(expected);
    });
  });

  describe("fetchScicatToken$", () => {
    it("should result in a fetchScicatTokenCompleteAction", () => {
      const token = {
        id: "testId",
        ttl: 100,
        scopes: ["string"],
        created: new Date().toISOString(),
        userId: "testId",
        user: "testUser",
      } as unknown as SDKToken;
      const action = fromActions.fetchScicatTokenAction();
      const outcome = fromActions.fetchScicatTokenCompleteAction({ token });

      actions = hot("-a", { a: action });
      authService.getToken.and.returnValue(token);

      const expected = cold("-b", { b: outcome });
      expect(effects.fetchScicatToken$).toBeObservable(expected);
    });
  });
});
