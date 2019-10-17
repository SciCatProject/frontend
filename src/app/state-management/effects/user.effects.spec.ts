import { Observable } from "rxjs";
import { UserEffects } from "./user.effects";
import {
  UserApi,
  UserIdentityApi,
  User,
  UserIdentity,
  AccessToken,
  LoopBackAuth,
  SDKToken
} from "shared/sdk";
import { ADAuthService } from "users/adauth.service";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import * as fromActions from "state-management/actions/user.actions";
import { hot, cold } from "jasmine-marbles";
import { MessageType } from "state-management/models";
import { Router } from "@angular/router";

describe("UserEffects", () => {
  let actions: Observable<any>;
  let effects: UserEffects;
  let activeDirAuthService: jasmine.SpyObj<ADAuthService>;
  let loopBackAuth: jasmine.SpyObj<LoopBackAuth>;
  let userApi: jasmine.SpyObj<UserApi>;
  let userIdentityApi: jasmine.SpyObj<UserIdentityApi>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions),
        {
          provide: ADAuthService,
          useValue: jasmine.createSpyObj("activeDirAuthService", ["login"])
        },
        {
          provide: LoopBackAuth,
          useValue: jasmine.createSpyObj("loopBackAuth", ["setToken"])
        },
        {
          provide: UserApi,
          useValue: jasmine.createSpyObj("userApi", [
            "findById",
            "login",
            "isAuthenticated",
            "logout",
            "getCurrent",
            "getCurrentToken"
          ])
        },
        {
          provide: UserIdentityApi,
          useValue: jasmine.createSpyObj("userIdentityApi", ["findOne"])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj("router", ["navigate"])
        }
      ]
    });

    effects = TestBed.get(UserEffects);
    activeDirAuthService = TestBed.get(ADAuthService);
    loopBackAuth = TestBed.get(LoopBackAuth);
    userApi = TestBed.get(UserApi);
    userIdentityApi = TestBed.get(UserIdentityApi);
    router = TestBed.get(Router);
  });

  describe("login$", () => {
    it("should redirect loginAction to activeDirLoginAction", () => {
      const form = {
        username: "test",
        password: "test",
        rememberMe: true
      };
      const action = fromActions.loginAction({ form });
      const outcome = fromActions.activeDirLoginAction({
        username: form.username,
        password: form.password,
        rememberMe: form.rememberMe
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
          userId: "testId"
        }
      };
      const action = fromActions.activeDirLoginAction({
        username,
        password,
        rememberMe
      });
      const outcome1 = fromActions.activeDirLoginSuccessAction();
      const outcome2 = fromActions.fetchUserAction({
        adLoginResponse: loginRes.body
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
        rememberMe
      });
      const outcome = fromActions.activeDirLoginFailedAction({
        username,
        password,
        rememberMe
      });

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      activeDirAuthService.login.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.adLogin$).toBeObservable(expected);
    });
  });

  describe("fetchUser$", () => {
    const adLoginResponse = {};
    const token = new SDKToken({
      id: "testId",
      userId: "testId"
    });

    it("should result in a fetchUserCompleteAction and a loginCompleteAction", () => {
      const user = new User();
      const accountType = "external";
      const action = fromActions.fetchUserAction({ adLoginResponse });
      const outcome1 = fromActions.fetchUserCompleteAction();
      const outcome2 = fromActions.loginCompleteAction({ user, accountType });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: user });
      loopBackAuth.setToken(token);
      userApi.findById.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.fetchUser$).toBeObservable(expected);
    });

    it("should result in a fetchUserFailedAction", () => {
      const action = fromActions.fetchUserAction({ adLoginResponse });
      const outcome = fromActions.fetchUserFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      loopBackAuth.setToken(token);
      userApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUser$).toBeObservable(expected);
    });
  });

  describe("loginRedirect$", () => {
    it("it should redirect activeDirLoginFailedAction to funcLoginAction", () => {
      const username = "test";
      const password = "test";
      const rememberMe = true;
      const action = fromActions.activeDirLoginFailedAction({
        username,
        password,
        rememberMe
      });
      const outcome = fromActions.funcLoginAction({
        username,
        password,
        rememberMe
      });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.loginRedirect$).toBeObservable(expected);
    });
  });

  describe("funcLogin$", () => {
    const username = "test";
    const password = "test";
    const rememberMe = true;

    it("should result in a funcLoginSuccessAction and a loginCompleteAction", () => {
      const user = new User();
      const accountType = "functional";
      const action = fromActions.funcLoginAction({
        username,
        password,
        rememberMe
      });
      const outcome1 = fromActions.funcLoginSuccessAction();
      const outcome2 = fromActions.loginCompleteAction({ user, accountType });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { user } });
      userApi.login.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.funcLogin$).toBeObservable(expected);
    });

    it("should result in a funcLoginFailedAction", () => {
      const action = fromActions.funcLoginAction({
        username,
        password,
        rememberMe
      });
      const outcome = fromActions.funcLoginFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.login.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.funcLogin$).toBeObservable(expected);
    });
  });

  describe("loginFailed$", () => {
    describe("ofType fetchUserFailedAction", () => {
      it("should result in a loginFailedAction", () => {
        const action = fromActions.fetchUserFailedAction();
        const outcome = fromActions.loginFailedAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loginFailed$).toBeObservable(expected);
      });
    });

    describe("ofType funcLoginFailedAction", () => {
      it("should result in a loginFailedAction", () => {
        const action = fromActions.funcLoginFailedAction();
        const outcome = fromActions.loginFailedAction();

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
        duration: 5000
      };
      const action = fromActions.loginFailedAction();
      const outcome = fromActions.showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.loginFailedMessage$).toBeObservable(expected);
    });
  });

  describe("logout$", () => {
    it("should result in a logoutCompleteAction", () => {
      const action = fromActions.logoutAction();
      const outcome = fromActions.logoutCompleteAction();

      actions = hot("-a", { a: action });
      const response = cold("-a|", {});
      userApi.isAuthenticated.and.returnValue(true);
      userApi.logout.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.logout$).toBeObservable(expected);
    });

    it("should result in a logoutFailedAction", () => {
      const action = fromActions.logoutAction();
      const outcome = fromActions.logoutFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.isAuthenticated.and.returnValue(true);
      userApi.logout.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.logout$).toBeObservable(expected);
    });
  });

  describe("logoutNavigate$", () => {
    it("should navigate to login page", () => {
      const action = fromActions.logoutCompleteAction();

      actions = hot("-a", { a: action });

      expect(effects.logoutNavigate$).toBeObservable(actions);
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    });
  });

  describe("fetchCurrentUser$", () => {
    it("should result in a fetchCurrentUserCompleteAction and a fetchUserIdentityAction", () => {
      const user = new User();
      user.id = "testId";
      const action = fromActions.fetchCurrentUserAction();
      const outcome1 = fromActions.fetchCurrentUserCompleteAction({ user });
      const outcome2 = fromActions.fetchUserIdentityAction({ id: user.id });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: user });
      userApi.getCurrent.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.fetchCurrentUser$).toBeObservable(expected);
    });

    it("should result in a fetchCurrentUserFailedAction", () => {
      const action = fromActions.fetchCurrentUserAction();
      const outcome = fromActions.fetchCurrentUserFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userApi.getCurrent.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCurrentUser$).toBeObservable(expected);
    });
  });

  describe("fetchUserIdentity$", () => {
    it("should result in a fetchUserIdentityCompleteAction", () => {
      const id = "testId";
      const userIdentity = new UserIdentity();
      const action = fromActions.fetchUserIdentityAction({ id });
      const outcome = fromActions.fetchUserIdentityCompleteAction({
        userIdentity
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: userIdentity });
      userIdentityApi.findOne.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserIdentity$).toBeObservable(expected);
    });

    it("should result in a fetchUserIdentityFailedAction", () => {
      const id = "testId";
      const action = fromActions.fetchUserIdentityAction({ id });
      const outcome = fromActions.fetchUserIdentityFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      userIdentityApi.findOne.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchUserIdentity$).toBeObservable(expected);
    });
  });

  describe("fetchCatamelToken$", () => {
    it("should result in a fetchCatamelTokenCompleteAction", () => {
      const token: AccessToken = {
        id: "testId",
        ttl: 100,
        scopes: ["string"],
        created: new Date(),
        userId: "testId",
        user: "testUser"
      };
      const action = fromActions.fetchCatamelTokenAction();
      const outcome = fromActions.fetchCatamelTokenCompleteAction({ token });

      actions = hot("-a", { a: action });
      userApi.getCurrentToken.and.returnValue(token);

      const expected = cold("-b", { b: outcome });
      expect(effects.fetchCatamelToken$).toBeObservable(expected);
    });
  });
});
