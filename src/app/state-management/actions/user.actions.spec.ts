import { Message, User, Settings, UserIdentity, MessageType } from "../models";
import * as fromActions from "./user.actions";
import { AccessToken, UserSetting } from "shared/sdk";
import { HttpErrorResponse } from "@angular/common/http";

describe("User Actions", () => {
  const error = new HttpErrorResponse({});
  describe("loginAction", () => {
    it("should create an action", () => {
      const form = { username: "", password: "", rememberMe: true };
      const action = fromActions.loginAction({ form });
      expect({ ...action }).toEqual({
        type: "[User] Login",
        form,
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
        accountType,
      });
    });
  });

  describe("loginFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.loginFailedAction({ error });
      expect({ ...action }).toEqual({
        type: "[User] Login Failed",
        error,
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
        rememberMe,
      });
      expect({ ...action }).toEqual({
        type: "[User] Active Directory Login",
        username,
        password,
        rememberMe,
      });
    });
  });

  describe("activeDirLoginSuccessAction", () => {
    it("should create an action", () => {
      const action = fromActions.activeDirLoginSuccessAction();
      expect({ ...action }).toEqual({
        type: "[User] Active Directory Login Success",
      });
    });
  });

  describe("activeDirLoginFailedAction", () => {
    it("should create an action", () => {
      const username = "test";
      const password = "test";
      const rememberMe = true;
      const action = fromActions.activeDirLoginFailedAction({
        error,
      });
      expect({ ...action }).toEqual({
        type: "[User] Active Directory Login Failed",
        error,
      });
    });
  });

  describe("funcLoginAction", () => {
    it("should create an action", () => {
      const username = "test";
      const password = "test";
      const rememberMe = true;
      const action = fromActions.funcLoginAction({
        form: {
          username,
          password,
          rememberMe,
        },
      });
      expect({ ...action }).toEqual({
        type: "[User] Functional Login",
        form: {
          username,
          password,
          rememberMe,
        },
      });
    });
  });

  describe("funcLoginSuccessAction", () => {
    it("should create an action", () => {
      const action = fromActions.funcLoginSuccessAction();
      expect({ ...action }).toEqual({
        type: "[User] Functional Login Success",
      });
    });
  });

  describe("funcLoginFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.funcLoginFailedAction({ error });
      expect({ ...action }).toEqual({
        type: "[User] Functional Login Failed",
        error,
      });
    });
  });

  describe("fetchUserAction", () => {
    it("should create an action", () => {
      const adLoginResponse = {};
      const action = fromActions.fetchUserAction({ adLoginResponse });
      expect({ ...action }).toEqual({
        type: "[User] Fetch User",
        adLoginResponse,
      });
    });
  });

  describe("fetchUserCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserCompleteAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Complete",
      });
    });
  });

  describe("fetchUserFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserFailedAction({ error });
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Failed",
        error,
      });
    });
  });

  describe("fetchCurrentUserAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCurrentUserAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch Current User",
      });
    });
  });

  describe("fetchCurrentUserCompleteAction", () => {
    it("should create an action", () => {
      const user = new User();
      const action = fromActions.fetchCurrentUserCompleteAction({ user });
      expect({ ...action }).toEqual({
        type: "[User] Fetch Current User Complete",
        user,
      });
    });
  });

  describe("fetchCurrentUserFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCurrentUserFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch Current User Failed",
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
        userIdentity,
      });
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Identity Complete",
        userIdentity,
      });
    });
  });

  describe("fetchUserIdentityFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserIdentityFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Identity Failed",
      });
    });
  });

  describe("fetchUserSettingsAction", () => {
    it("should create an action", () => {
      const id = "testId";
      const action = fromActions.fetchUserSettingsAction({ id });
      expect({ ...action }).toEqual({ type: "[User] Fetch User Settings", id });
    });
  });

  describe("fetchUserSettingsCompleteAction", () => {
    it("should create an action", () => {
      const userSettings = new UserSetting({
        columns: [],
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
      });
      const action = fromActions.fetchUserSettingsCompleteAction({
        userSettings,
      });
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Settings Complete",
        userSettings,
      });
    });
  });

  describe("fetchUserSettingsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchUserSettingsFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch User Settings Failed",
      });
    });
  });

  describe("updateUserSettingsAction", () => {
    it("should create an action", () => {
      const property = { columns: [] };
      const action = fromActions.updateUserSettingsAction({ property });
      expect({ ...action }).toEqual({
        type: "[User] Update User Settings",
        property,
      });
    });
  });

  describe("updateUserSettingsCompleteAction", () => {
    it("should create an action", () => {
      const userSettings = new UserSetting({
        columns: [],
        datasetCount: 25,
        jobCount: 25,
        userId: "testId",
        id: "testId",
      });
      const action = fromActions.updateUserSettingsCompleteAction({
        userSettings,
      });
      expect({ ...action }).toEqual({
        type: "[User] Update User Settings Complete",
        userSettings,
      });
    });
  });

  describe("updateUserSettingsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.updateUserSettingsFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Update User Settings Failed",
      });
    });
  });

  describe("fetchScicatTokenAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchScicatTokenAction();
      expect({ ...action }).toEqual({ type: "[User] Fetch Scicat Token" });
    });
  });

  describe("fetchScicatTokenCompleteAction", () => {
    it("should create an action", () => {
      const token = new AccessToken();
      const action = fromActions.fetchScicatTokenCompleteAction({ token });
      expect({ ...action }).toEqual({
        type: "[User] Fetch Scicat Token Complete",
        token,
      });
    });
  });

  describe("fetchScicatTokenFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchScicatTokenFailedAction();
      expect({ ...action }).toEqual({
        type: "[User] Fetch Scicat Token Failed",
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

  describe("addCustomColumnsAction", () => {
    it("should create an action", () => {
      const names = ["test"];
      const action = fromActions.addCustomColumnsAction({ names });
      expect({ ...action }).toEqual({
        type: "[User] Add Custom Columns",
        names,
      });
    });
  });

  describe("addCustomColumnsCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.addCustomColumnsCompleteAction();
      expect({ ...action }).toEqual({
        type: "[User] Add Custom Columns Complete",
      });
    });
  });

  describe("selectColumnAction", () => {
    it("should create an action", () => {
      const name = "test";
      const columnType = "standard";
      const action = fromActions.selectColumnAction({ name, columnType });
      expect({ ...action }).toEqual({
        type: "[User] Select Column",
        name,
        columnType,
      });
    });
  });

  describe("deselectColumnAction", () => {
    it("should create an action", () => {
      const name = "test";
      const columnType = "standard";
      const action = fromActions.deselectColumnAction({ name, columnType });
      expect({ ...action }).toEqual({
        type: "[User] Deselect Column",
        name,
        columnType,
      });
    });
  });

  describe("deselectAllCustomColumnsAction", () => {
    it("should create an action", () => {
      const action = fromActions.deselectAllCustomColumnsAction();
      expect({ ...action }).toEqual({
        type: "[User] Deselect All Custom Columns",
      });
    });
  });

  describe("showMessageAction", () => {
    it("should create an action", () => {
      const message = new Message("Test", MessageType.Success, 5000);
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
        darkTheme: false,
      };
      const action = fromActions.saveSettingsAction({ settings });
      expect({ ...action }).toEqual({ type: "[User] Save Settings", settings });
    });
  });

  describe("loadingAction", () => {
    it("should create an action", () => {
      const action = fromActions.loadingAction();
      expect({ ...action }).toEqual({
        type: "[User] Loading",
      });
    });
  });

  describe("loadingCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.loadingCompleteAction();
      expect({ ...action }).toEqual({
        type: "[User] Loading Complete",
      });
    });
  });
});
