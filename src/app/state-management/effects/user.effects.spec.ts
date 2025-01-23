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
import { hot, cold } from "jasmine-marbles";
import { MessageType } from "state-management/models";
import { Router } from "@angular/router";
import { provideMockStore } from "@ngrx/store/testing";
import {
  selectColumns,
  selectCurrentUser,
} from "state-management/selectors/user.selectors";
import {
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
import { Type } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { AppConfigService } from "app-config.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
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
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
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
            "authControllerLogin",
            "authControllerLogout",
          ]),
        },
        {
          provide: UsersService,
          useValue: jasmine.createSpyObj("userApi", [
            "usersControllerFindById",
            "usersControllerGetSettings",
            "usersControllerPatchExternalSettings",
            "usersControllerGetMyUser",
          ]),
        },
        {
          provide: UserIdentitiesService,
          useValue: jasmine.createSpyObj("userIdentityApi", [
            "userIdentitiesControllerFindOne",
          ]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj("router", ["navigate"]),
        },
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
      userApi.usersControllerFindById.and.returnValue(response);

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
      userApi.usersControllerFindById.and.returnValue(response);

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
      userApi.usersControllerFindById.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.oidcFetchUser$).toBeObservable(expected);
    });

    it("should result in a fetchUserFailedAction", () => {
      const action = fromActions.loginOIDCAction({ oidcLoginResponse });
      const outcome = fromActions.fetchUserFailedAction({ error });

      actions = hot("-a", { a: action });
      const response = cold("-#", {}, error);
      authService.setToken(token);
      userApi.usersControllerFindById.and.returnValue(response);

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
      sharedAuthService.authControllerLogin.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.funcLogin$).toBeObservable(expected);
    });

    it("should result in a funcLoginFailedAction", () => {
      const action = fromActions.funcLoginAction({ form });
      const outcome = fromActions.funcLoginFailedAction({ error });

      actions = hot("-a", { a: action });
      const response = cold("-#", {}, error);
      sharedAuthService.authControllerLogin.and.returnValue(response);

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
      sharedAuthService.authControllerLogout.and.returnValue(response);

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
      sharedAuthService.authControllerLogout.and.returnValue(response);

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
        created: new Date(),
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
      userApi.usersControllerGetMyUser.and.returnValue(response);

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
        created: new Date(),
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
      userApi.usersControllerGetMyUser.and.returnValue(response);

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
        created: new Date(1611438651),
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
      userIdentityApi.userIdentitiesControllerFindOne.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserIdentity$).toBeObservable(expected);
    });

    it("should result in a fetchUserIdentityFailedAction", () => {
      const id = "testId";
      const action = fromActions.fetchUserIdentityAction({ id });
      const outcome = fromActions.fetchUserIdentityFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userIdentityApi.userIdentitiesControllerFindOne.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserIdentity$).toBeObservable(expected);
    });
  });

  describe("fetchUserSettings$", () => {
    const id = "testId";

    it("should result in a fetchUserSettingsCompleteAction", () => {
      const userSettings = {
        columns: [],
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
      } as unknown as UserSettings;
      const action = fromActions.fetchUserSettingsAction({ id });
      const outcome = fromActions.fetchUserSettingsCompleteAction({
        userSettings,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: userSettings });
      userApi.usersControllerGetSettings.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserSettings$).toBeObservable(expected);
    });

    it("should result in a fetchUserSettingsFailedAction", () => {
      const action = fromActions.fetchUserSettingsAction({ id });
      const outcome = fromActions.fetchUserSettingsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.usersControllerGetSettings.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserSettings$).toBeObservable(expected);
    });
  });

  describe("setLimitFilters$", () => {
    it("should result in a setDatasetsLimitFilterAction and a setJobsLimitFilterAction", () => {
      const userSettings = {
        columns: [],
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

  describe("addCustomColumns$", () => {
    it("should result in an addCustomColumnsCompleteAction", () => {
      const names = ["test"];
      const action = fromActions.addCustomColumnsAction({ names });
      const outcome = fromActions.addCustomColumnsCompleteAction();

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.addCustomColumns$).toBeObservable(expected);
    });
  });

  describe("updateUserColumns$", () => {
    const property = { columns: [] };
    describe("ofType selectColumnAction", () => {
      it("should dispatch an updateUserSettingsAction", () => {
        const name = "test";
        const columnType = "standard";
        const action = fromActions.selectColumnAction({ name, columnType });
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
        const action = fromActions.deselectColumnAction({ name, columnType });
        const outcome = fromActions.updateUserSettingsAction({ property });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateUserColumns$).toBeObservable(expected);
      });
    });

    describe("ofType deselectAllCustomColumnsAction", () => {
      it("should dispatch an updateUserSettingsAction", () => {
        const action = fromActions.deselectAllCustomColumnsAction();
        const outcome = fromActions.updateUserSettingsAction({ property });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateUserColumns$).toBeObservable(expected);
      });
    });
  });

  describe("updateUserSettings$", () => {
    const property = { columns: [] };

    it("should result in an updateUserSettingsCompleteAction", () => {
      // TODO: try to fix the types here instead of using type casting and conversion
      const userSettings = {
        columns: [],
        filters: [],
        conditions: [],
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
      } as unknown as UserSettings;

      const apiResponse = {
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
        externalSettings: {
          columns: [],
          filters: [],
          conditions: [],
        },
      };
      const action = fromActions.updateUserSettingsAction({ property });
      const outcome = fromActions.updateUserSettingsCompleteAction({
        userSettings,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: apiResponse });
      userApi.usersControllerPatchExternalSettings.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateUserSettings$).toBeObservable(expected);
    });

    it("should result in an updateUserSettingsFailedAction", () => {
      const action = fromActions.updateUserSettingsAction({ property });
      const outcome = fromActions.updateUserSettingsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.usersControllerPatchExternalSettings.and.returnValue(response);

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
        created: new Date(),
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
