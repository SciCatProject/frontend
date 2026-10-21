import { userReducer } from "./user.reducer";
import { initialUserState } from "../state/user.store";
import * as fromActions from "../actions/user.actions";
import { MessageType, Message, Settings, TableColumn } from "../models";
import { HttpErrorResponse } from "@angular/common/http";
import {
  ReturnedUserDto,
  UserIdentity,
} from "@scicatproject/scicat-sdk-ts-angular";
import { SDKToken } from "shared/services/auth/auth.service";

describe("UserReducer", () => {
  describe("on setTableColumnsAction", () => {
    it("should set the columns", () => {
      const columns: TableColumn[] = [
        { name: "testColumn", order: 0, type: "standard", enabled: true },
      ];
      const action = fromActions.setTableColumnsAction({
        columns,
        scope: "dataset",
      });
      const state = userReducer(initialUserState, action);

      expect(state.settings.fe_dataset_table_columns.length).toEqual(1);
    });
  });

  describe("on loginAction", () => {
    it("should set isLoggingIn to true and isLoggedIn to false", () => {
      const form = {
        username: "test",
        password: "test",
        rememberMe: true,
      };
      const action = fromActions.loginAction({ form });
      const state = userReducer(initialUserState, action);

      expect(state.isLoggingIn).toEqual(true);
      expect(state.isLoggedIn).toEqual(false);
    });
  });

  describe("on loginCompletAction", () => {
    it("should set currentUser, accountType, and set isLoggingIn to false and isLoggedIn to true", () => {
      const user: ReturnedUserDto = {
        id: "",
        authStrategy: "",
        email: "",
        username: "",
      };
      const accountType = "test";
      const action = fromActions.loginCompleteAction({ user, accountType });
      const state = userReducer(initialUserState, action);

      expect(state.currentUser).toEqual(user);
      expect(state.accountType).toEqual(accountType);
      expect(state.isLoggingIn).toEqual(false);
      expect(state.isLoggedIn).toEqual(true);
    });

    const user1 = { id: "user1", authStrategy: "", email: "", username: "" };
    const profile = { accessGroups: ["p1234"] };

    it("should drop the profile of a previous user", () => {
      const action = fromActions.loginCompleteAction({
        user: { ...user1, id: "user2" },
        accountType: "test",
      });
      const state = userReducer(
        {
          ...initialUserState,
          currentUser: user1,
          profile,
          hasFetchedProfile: true,
        },
        action,
      );

      expect(state.profile).toBeNull();
      expect(state.hasFetchedProfile).toBeFalse();
    });

    it("should keep the profile when the same user completes the login again", () => {
      const action = fromActions.loginCompleteAction({
        user: user1,
        accountType: "test",
      });
      const state = userReducer(
        {
          ...initialUserState,
          currentUser: user1,
          profile,
          hasFetchedProfile: true,
        },
        action,
      );

      expect(state.profile).toEqual(profile);
      expect(state.hasFetchedProfile).toBeTrue();
    });
  });

  describe("on loginFailedAction", () => {
    it("should set both isLoggingIn and isLoggedIn to false", () => {
      const error = new HttpErrorResponse({});
      const action = fromActions.loginFailedAction(error);
      const state = userReducer(initialUserState, action);

      expect(state.isLoggingIn).toEqual(false);
      expect(state.isLoggedIn).toEqual(false);
    });
  });

  describe("on fetchCurrentUserCompleteAction", () => {
    it("should set currentUser and set isLoggedIn to true", () => {
      const user: ReturnedUserDto = {
        id: "",
        authStrategy: "",
        email: "",
        username: "",
      };
      const action = fromActions.fetchCurrentUserCompleteAction({ user });
      const state = userReducer(initialUserState, action);

      expect(state.currentUser).toEqual(user);
      expect(state.isLoggedIn).toEqual(true);
    });
  });

  describe("on fetchUserIdentityCompleteAction", () => {
    const profile = {
      accessGroups: ["p1234"],
      displayName: "",
      email: "",
      emails: [],
      id: "",
      oidcClaims: [],
      thumbnailPhoto: "",
      username: "",
    };
    const identityOf = (userId: string): UserIdentity => ({
      authStrategy: "",
      created: "",
      credentials: {},
      externalId: "",
      modified: "",
      profile,
      provider: "",
      userId,
    });
    const loggedInAs = (id: string) => ({
      ...initialUserState,
      currentUser: { id, authStrategy: "", email: "", username: "" },
    });

    it("should set the profile of the current user", () => {
      const action = fromActions.fetchUserIdentityCompleteAction({
        userIdentity: identityOf("user1"),
      });
      const state = userReducer(loggedInAs("user1"), action);

      expect(state.profile).toEqual(profile);
      expect(state.hasFetchedProfile).toBeTrue();
    });

    it("should ignore the profile of another user", () => {
      const action = fromActions.fetchUserIdentityCompleteAction({
        userIdentity: identityOf("user1"),
      });
      const state = userReducer(
        { ...loggedInAs("user2"), profile: null },
        action,
      );

      expect(state.profile).toBeNull();
      expect(state.hasFetchedProfile).toBeFalse();
    });

    it("should ignore a late response after logout", () => {
      const action = fromActions.fetchUserIdentityCompleteAction({
        userIdentity: identityOf("user1"),
      });
      const state = userReducer(
        { ...initialUserState, currentUser: undefined, profile: null },
        action,
      );

      expect(state.profile).toBeNull();
    });
  });

  describe("when the user has no identity", () => {
    it("should stop waiting for the profile", () => {
      const action = fromActions.fetchUserIdentityCompleteAction({
        userIdentity: null,
      });
      const state = userReducer(initialUserState, action);

      expect(state.profile).toBeNull();
      expect(state.hasFetchedProfile).toBeTrue();
    });
  });

  describe("on fetchUserIdentityFailedAction", () => {
    it("should stop waiting for the profile", () => {
      const action = fromActions.fetchUserIdentityFailedAction();
      const state = userReducer(initialUserState, action);

      expect(state.hasFetchedProfile).toBeTrue();
    });
  });

  describe("on fetchUserSettingsCompleteAction", () => {
    it("should set jobCount and datasetCount settings, and columns if not empty", () => {
      const datasetColumns: TableColumn[] = [
        { name: "test", order: 0, type: "standard", enabled: true },
      ];
      const userSettings = {
        datasetCount: 50,
        jobCount: 50,
        userId: "testId",
        externalSettings: {
          fe_dataset_table_columns: datasetColumns,
        },
        id: "testId",
      };
      const action = fromActions.fetchUserSettingsCompleteAction({
        userSettings,
      });
      const state = userReducer(initialUserState, action);

      expect(state.settings.datasetCount).toEqual(userSettings.datasetCount);
      expect(state.settings.jobCount).toEqual(userSettings.jobCount);
      expect(state.settings.fe_dataset_table_columns).toEqual(
        userSettings.externalSettings.fe_dataset_table_columns,
      );
    });

    it("should set jobCount and datasetCount settings, and not columns if empty", () => {
      const userSettings = {
        datasetCount: 50,
        jobCount: 50,
        userId: "testId",
        id: "testId",
        externalSettings: {
          fe_dataset_table_columns: [],
        },
      };
      const action = fromActions.fetchUserSettingsCompleteAction({
        userSettings,
      });
      const state = userReducer(initialUserState, action);

      expect(state.settings.datasetCount).toEqual(userSettings.datasetCount);
      expect(state.settings.jobCount).toEqual(userSettings.jobCount);
      expect(state.settings.fe_dataset_table_columns).toEqual(
        initialUserState.settings.fe_dataset_table_columns,
      );
    });
  });

  describe("on updateUserSettingsCompleteAction", () => {
    it("should set jobCount and datasetCount settings, and columns if not empty", () => {
      const datasetColumns: TableColumn[] = [
        { name: "test", order: 0, type: "standard", enabled: true },
      ];
      const userSettings = {
        datasetCount: 50,
        jobCount: 50,
        userId: "testId",
        externalSettings: {
          fe_dataset_table_columns: datasetColumns,
        },
        id: "testId",
      };
      const action = fromActions.updateUserSettingsCompleteAction({
        userSettings,
      });
      const state = userReducer(initialUserState, action);

      expect(state.settings.datasetCount).toEqual(userSettings.datasetCount);
      expect(state.settings.jobCount).toEqual(userSettings.jobCount);
      expect(state.settings.fe_dataset_table_columns).toEqual(
        userSettings.externalSettings.fe_dataset_table_columns,
      );
    });

    it("should set jobCount and datasetCount settings, and not columns if empty", () => {
      const userSettings = {
        datasetCount: 50,
        jobCount: 50,
        userId: "testId",
        externalSettings: {
          fe_dataset_table_columns: [],
        },
        id: "testId",
      };
      const action = fromActions.updateUserSettingsCompleteAction({
        userSettings,
      });
      const state = userReducer(initialUserState, action);

      expect(state.settings.datasetCount).toEqual(userSettings.datasetCount);
      expect(state.settings.jobCount).toEqual(userSettings.jobCount);
      expect(state.settings.fe_dataset_table_columns).toEqual(
        initialUserState.settings.fe_dataset_table_columns,
      );
    });
  });

  describe("on fetchScicatTokenCompleteAction", () => {
    it("should set scicatToken", () => {
      const token: SDKToken = {
        id: "testId",
        ttl: 100,
        scopes: ["string"],
        created: new Date().toISOString(),
        userId: "testId",
        rememberMe: false,
        user: {
          id: "test",
          email: "test@test.com",
          username: "testUsername",
          authStrategy: "local",
        },
      };
      const action = fromActions.fetchScicatTokenCompleteAction({ token });
      const state = userReducer(initialUserState, action);

      expect(state.scicatToken).toEqual(token);
    });
  });

  describe("on logoutCompleteAction", () => {
    it("should reset the state to initial state", () => {
      const action = fromActions.logoutCompleteAction({});
      const state = userReducer(initialUserState, action);

      expect(state).toEqual(initialUserState);
    });
  });

  describe("on addColumnAction", () => {
    it("should append a new column to the columns property", () => {
      const names = ["test"];
      const action = fromActions.addCustomColumnsAction({
        names,
        scope: "dataset",
      });
      const state = userReducer(initialUserState, action);

      expect(
        state.settings.fe_dataset_table_columns[
          state.settings.fe_dataset_table_columns.length - 1
        ].name,
      ).toEqual("test");
      expect(
        state.settings.fe_dataset_table_columns[
          state.settings.fe_dataset_table_columns.length - 1
        ].order,
      ).toEqual(state.settings.fe_dataset_table_columns.length - 1);
      expect(
        state.settings.fe_dataset_table_columns[
          state.settings.fe_dataset_table_columns.length - 1
        ].enabled,
      ).toEqual(false);
    });
  });

  describe("on selectColumnAction", () => {
    it("should set enabled to true for a column in columns", () => {
      const name = "dataStatus";
      const columnType = "standard";

      const action = fromActions.selectColumnAction({
        name,
        columnType,
        scope: "dataset",
      });
      const state = userReducer(initialUserState, action);

      state.settings.fe_dataset_table_columns.forEach((column) => {
        if (column.name === name && column.type === columnType) {
          expect(column.enabled).toEqual(true);
        }
      });
    });
  });

  describe("on deselectColumnAction", () => {
    it("should set enabled to false for a column in columns", () => {
      const name = "datasetName";
      const columnType = "standard";

      const action = fromActions.deselectColumnAction({
        name,
        columnType,
        scope: "dataset",
      });
      const state = userReducer(initialUserState, action);

      state.settings.fe_dataset_table_columns.forEach((column) => {
        if (column.name === name && column.type === columnType) {
          expect(column.enabled).toEqual(false);
        }
      });
    });
  });

  describe("on showMessageAction", () => {
    it("should set message", () => {
      const message: Message = {
        content: "",
        type: MessageType.Success,
        duration: 500000,
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
        darkTheme: false,
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
