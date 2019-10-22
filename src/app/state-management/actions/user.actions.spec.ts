import { Message, User, Settings, UserIdentity } from "../models";
import * as fromActions from "./user.actions";
import { AccessToken } from "shared/sdk";

describe("User Aactions", () => {
  describe("loginAction", () => {
    it("should create an action", () => {
      const form = { username: "", password: "", rememberMe: true };
      const action = fromActions.loginAction({ form });
      expect({ ...action }).toEqual({
        type: "[User] Login",
        form
      });
    });
  });

  describe("loginCompleteAction", () => {
    it("should create an action", () => {
      const user = new User();
      const accountType = "test";
      const action = fromActions.loginCompleteAction({ user, accountType });
      expect({ ...action }).toEqual({
        type: "[User] Login Complete",
        user,
        accountType
      });
    });
  });

  describe("loginFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.loginFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Login Failed"
      });
    });
  });

  describe("activeDirLoginAction", () => {
    it("should create an action", () => {
      const username = "test";
      const password = "test";
      const rememberMe = true;
      const action = fromActions.activeDirLoginAction({
        username,
        password,
        rememberMe
      });
      expect({ ...action }).toEqual({
        type: "[User] Active Directory Login",
        username,
        password,
        rememberMe
      });
    });
  });

  describe("activeDirLoginSuccessAction", () => {
    it("should create an action", () => {
      const action = fromActions.activeDirLoginSuccessAction();
      expect({ ...action }).toEqual({
        type: "[User] Active Directory Login Success"
      });
    });
  });

  describe("activeDirLoginFailedAction", () => {
    it("should create an action", () => {
      const username = "test";
      const password = "test";
      const rememberMe = true;
      const action = fromActions.activeDirLoginFailedAction({
        username,
        password,
        rememberMe
      });
      expect({ ...action }).toEqual({
        type: "[User] Active Directory Login Failed",
        username,
        password,
        rememberMe
      });
    });
  });

  describe("funcLoginAction", () => {
    it("should create an action", () => {
      const username = "test";
      const password = "test";
      const rememberMe = true;
      const action = fromActions.funcLoginAction({
        username,
        password,
        rememberMe
      });
      expect({ ...action }).toEqual({
        type: "[User] Functional Login",
        username,
        password,
        rememberMe
      });
    });
  });

  describe("funcLoginSuccessAction", () => {
    it("should create an action", () => {
      const action = fromActions.funcLoginSuccessAction();
      expect({ ...action }).toEqual({
        type: "[User] Functional Login Success"
      });
    });
  });

  describe("funcLoginFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.funcLoginFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Functional Login Failed"
      });
    });
  });

  describe("fetchUserAction", () => {
    it("should create an action", () => {
      const adLoginResponse = {};
      const action = fromActions.fetchUserAction({ adLoginResponse });
      expect({ ...action }).toEqual({
        type: "[User] Fetch User",
        adLoginResponse
      });
    });
  });

  describe("fetchUserCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserCompleteAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Complete"
      });
    });
  });

  describe("fetchUserFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Failed"
      });
    });
  });

  describe("fetchCurrentUserAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCurrentUserAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch Current User"
      });
    });
  });

  describe("fetchCurrentUserCompleteAction", () => {
    it("should create an action", () => {
      const user = new User();
      const action = fromActions.fetchCurrentUserCompleteAction({ user });
      expect({ ...action }).toEqual({
        type: "[User] Fetch Current User Complete",
        user
      });
    });
  });

  describe("fetchCurrentUserFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCurrentUserFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch Current User Failed"
      });
    });
  });

  describe("fetchUserIdentityAction", () => {
    it("should create an action", () => {
      const id = "testId";
      const action = fromActions.fetchUserIdentityAction({ id });
      expect({ ...action }).toEqual({ type: "[User] Fetch User Identity", id });
    });
  });

  describe("fetchUserIdentityCompleteAction", () => {
    it("should create an action", () => {
      const userIdentity = new UserIdentity();
      const action = fromActions.fetchUserIdentityCompleteAction({
        userIdentity
      });
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Identity Complete",
        userIdentity
      });
    });
  });

  describe("fetchUserIdentityFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserIdentityFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Identity Failed"
      });
    });
  });

  describe("fetchCatamelTokenAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCatamelTokenAction();
      expect({ ...action }).toEqual({ type: "[User] Fetch Catamel Token" });
    });
  });

  describe("fetchCatamelTokenCompleteAction", () => {
    it("should create an action", () => {
      const token = new AccessToken();
      const action = fromActions.fetchCatamelTokenCompleteAction({ token });
      expect({ ...action }).toEqual({
        type: "[User] Fetch Catamel Token Complete",
        token
      });
    });
  });

  describe("fetchCatamelTokenFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCatamelTokenFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch Catamel Token Failed"
      });
    });
  });

  describe("logoutAction", () => {
    it("should create an action", () => {
      const action = fromActions.logoutAction();
      expect({ ...action }).toEqual({ type: "[User] Logout" });
    });
  });

  describe("logoutCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.logoutCompleteAction();
      expect({ ...action }).toEqual({ type: "[User] Logout Complete" });
    });
  });

  describe("logoutFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.logoutFailedAction();
      expect({ ...action }).toEqual({ type: "[User] Logout Failed" });
    });
  });

  describe("selectColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const action = fromActions.selectColumnAction({ column });
      expect({ ...action }).toEqual({ type: "[User] Select Column", column });
    });
  });

  describe("deselectColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const action = fromActions.deselectColumnAction({ column });
      expect({ ...action }).toEqual({ type: "[User] Deselect Column", column });
    });
  });

  describe("showMessageAction", () => {
    it("should create an action", () => {
      const message = new Message();
      const action = fromActions.showMessageAction({ message });
      expect({ ...action }).toEqual({ type: "[User] Show Message", message });
    });
  });

  describe("clearMessageAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearMessageAction();
      expect({ ...action }).toEqual({ type: "[User] Clear Message" });
    });
  });

  describe("saveSettingsAction", () => {
    it("should create an action", () => {
      const settings: Settings = {
        tapeCopies: "",
        datasetCount: 0,
        jobCount: 0,
        darkTheme: false
      };
      const action = fromActions.saveSettingsAction({ settings });
      expect({ ...action }).toEqual({ type: "[User] Save Settings", settings });
    });
  });

  describe("loadingAction", () => {
    it("should create an action", () => {
      const action = fromActions.loadingAction();
      expect({ ...action }).toEqual({
        type: "[User] Loading"
      });
    });
  });

  describe("loadingCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.loadingCompleteAction();
      expect({ ...action }).toEqual({
        type: "[User] Loading Complete"
      });
    });
  });
});
