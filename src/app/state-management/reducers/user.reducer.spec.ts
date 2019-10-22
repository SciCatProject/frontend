import { userReducer } from "./user.reducer";
import { initialUserState } from "../state/user.store";
import * as fromActions from "../actions/user.actions";
import { User, MessageType, Message, Settings, UserIdentity } from "../models";
import { AccessToken } from "shared/sdk";

describe("UserReducer", () => {
  describe("on loginAction", () => {
    it("should set isLoggingIn to true and isLoggedIn to false", () => {
      const form = {
        username: "test",
        password: "test",
        rememberMe: true
      };
      const action = fromActions.loginAction({ form });
      const state = userReducer(initialUserState, action);

      expect(state.isLoggingIn).toEqual(true);
      expect(state.isLoggedIn).toEqual(false);
    });
  });

  describe("on loginCompletAction", () => {
    it("should set currentUser, accountType, and set isLoggingIn to false and isLoggedIn to true", () => {
      const user = new User();
      const accountType = "test";
      const action = fromActions.loginCompleteAction({ user, accountType });
      const state = userReducer(initialUserState, action);

      expect(state.currentUser).toEqual(user);
      expect(state.accountType).toEqual(accountType);
      expect(state.isLoggingIn).toEqual(false);
      expect(state.isLoggedIn).toEqual(true);
    });
  });

  describe("on loginFailedAction", () => {
    it("should set both isLoggingIn and isLoggedIn to false", () => {
      const action = fromActions.loginFailedAction();
      const state = userReducer(initialUserState, action);

      expect(state.isLoggingIn).toEqual(false);
      expect(state.isLoggedIn).toEqual(false);
    });
  });

  describe("on fetchCurrentUserCompleteAction", () => {
    it("should set currentUser and set isLoggedIn to true", () => {
      const user = new User();
      const action = fromActions.fetchCurrentUserCompleteAction({ user });
      const state = userReducer(initialUserState, action);

      expect(state.currentUser).toEqual(user);
      expect(state.isLoggedIn).toEqual(true);
    });
  });

  describe("on fetchUserIdentityCompleteAction", () => {
    it("should set profile", () => {
      const userIdentity = new UserIdentity();
      const action = fromActions.fetchUserIdentityCompleteAction({
        userIdentity
      });
      const state = userReducer(initialUserState, action);

      expect(state.profile).toEqual(userIdentity.profile);
    });
  });

  describe("on fetchCatamelTokenCompleteAction", () => {
    it("should set catamelToken", () => {
      const token = new AccessToken();
      const action = fromActions.fetchCatamelTokenCompleteAction({ token });
      const state = userReducer(initialUserState, action);

      expect(state.catamelToken).toEqual(token);
    });
  });

  describe("on logoutCompleteAction", () => {
    it("should reset the state to initial state", () => {
      const action = fromActions.logoutCompleteAction();
      const state = userReducer(initialUserState, action);

      expect(state).toEqual(initialUserState);
    });
  });

  describe("on selectColumnAction", () => {
    it("should set enabled to true for a column in columns", () => {
      const column = "dataStatus";
      const action = fromActions.selectColumnAction({ column });
      const state = userReducer(initialUserState, action);

      state.columns.forEach(item => {
        if (item.name === column) {
          expect(item.enabled).toEqual(true);
        }
      });
    });
  });

  describe("on deselectColumnAction", () => {
    it("should set enabled to false for a column in columns", () => {
      const column = "datasetName";

      const action = fromActions.deselectColumnAction({ column });
      const state = userReducer(initialUserState, action);

      state.columns.forEach(item => {
        if (item.name === column) {
          expect(item.enabled).toEqual(false);
        }
      });
    });
  });

  describe("on showMessageAction", () => {
    it("should set message", () => {
      const message: Message = {
        content: "",
        type: MessageType.Success,
        duration: 500000
      };
      const action = fromActions.showMessageAction({ message });
      const state = userReducer(initialUserState, action);

      expect(state.message).toEqual(message);
    });
  });

  describe("on clearMessageAction", () => {
    it("should clear message", () => {
      const action = fromActions.clearMessageAction();
      const state = userReducer(initialUserState, action);

      expect(state.message).toEqual(initialUserState.message);
    });
  });

  describe("on saveSettingsAction", () => {
    it("should set settings", () => {
      const settings: Settings = {
        tapeCopies: "",
        datasetCount: 0,
        jobCount: 0,
        darkTheme: false
      };
      const action = fromActions.saveSettingsAction({ settings });
      const state = userReducer(initialUserState, action);

      expect(state.settings).toEqual(settings);
    });
  });

  describe("on loadingAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.loadingAction();
      const state = userReducer(initialUserState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on loadingCompleteAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.loadingCompleteAction();
      const state = userReducer(initialUserState, action);

      expect(state.isLoading).toEqual(false);
    });
  });
});
