import * as fromSelectors from "./user.selectors";

import { UserState } from "../state/user.store";
import { Settings } from "../models";
import {
  ReturnedUserDto,
  UserIdentity,
} from "@scicatproject/scicat-sdk-ts-angular";
import { SDKToken } from "shared/services/auth/auth.service";

const user: ReturnedUserDto = {
  id: "testId",
  realm: "testRealm",
  username: "testName",
  email: "test@email.com",
  emailVerified: true,
  authStrategy: "local",
};

const userIdentity: UserIdentity = {
  ...user,
  provider: "testProvider",
  externalId: "testId",
  credentials: null,
  userId: "testId",
  created: new Date().toDateString(),
  modified: new Date().toDateString(),
  profile: {
    id: "testId",
    displayName: "testName",
    email: "test@email.com",
    username: "testName",
    thumbnailPhoto: "data",
    accessGroups: [],
    emails: [],
    oidcClaims: [],
  },
};

const scicatToken: SDKToken = {
  id: "testId",
  ttl: 100,
  scopes: ["string"],
  created: new Date(),
  userId: "testId",
  user: null,
  rememberMe: false,
};

const settings: Settings = {
  tapeCopies: "one",
  datasetCount: 25,
  jobCount: 25,
  darkTheme: false,
};

const initialUserState: UserState = {
  currentUser: user,
  profile: userIdentity.profile,
  accountType: "testType",

  scicatToken,

  settings,

  message: undefined,

  isLoggingIn: false,
  isLoggedIn: false,

  isLoading: false,

  columns: [{ name: "datasetName", order: 1, type: "standard", enabled: true }],

  filters: [
    { LocationFilter: true },
    { PidFilter: true },
    { GroupFilter: true },
    { TypeFilter: true },
    { KeywordFilter: true },
    { DateRangeFilter: true },
    { TextFilter: true },
    { PidFilterContains: false },
    { PidFilterStartsWith: false },
  ],

  conditions: [],
  tablesSettings: {},
};

describe("User Selectors", () => {
  describe("selectCurrentUser", () => {
    it("should select currentUser", () => {
      expect(
        fromSelectors.selectCurrentUser.projector(initialUserState),
      ).toEqual(user);
    });
  });

  describe("selectCurrentUserId", () => {
    it("should select the id from currentUser", () => {
      expect(
        fromSelectors.selectCurrentUserId.projector(
          initialUserState.currentUser,
        ),
      ).toEqual("testId");
    });
  });

  describe("selectProfile", () => {
    it("should select profile", () => {
      expect(fromSelectors.selectProfile.projector(initialUserState)).toEqual(
        userIdentity.profile,
      );
    });
  });

  describe("selectCurrentUserName", () => {
    it("should select the username either from profile or currentUser", () => {
      expect(
        fromSelectors.selectCurrentUserName.projector(
          initialUserState.profile,
          initialUserState.currentUser,
        ),
      ).toEqual("testName");
    });
  });

  describe("selectThumbnailPhoto", () => {
    it("should return a thumbnail photo string if it exists", () => {
      expect(
        fromSelectors.selectThumbnailPhoto.projector(initialUserState.profile),
      ).toEqual("data");
    });
  });

  describe("selectIsAdmin", () => {
    it("should return false if currentUser is not a functional account", () => {
      const username = initialUserState.currentUser
        ? initialUserState.currentUser.username
        : "";
      expect(fromSelectors.selectIsAdmin.projector(username)).toEqual(false);
    });
  });

  describe("selectScicatToken", () => {
    it("should select scicatToken", () => {
      expect(
        fromSelectors.selectScicatToken.projector(initialUserState),
      ).toEqual(scicatToken.id);
    });
  });

  describe("selectUserMessage", () => {
    it("should select message", () => {
      expect(fromSelectors.selectUserMessage.projector(initialUserState)).toBe(
        undefined,
      );
    });
  });

  describe("selectSettings", () => {
    it("should select settings", () => {
      expect(fromSelectors.selectSettings.projector(initialUserState)).toEqual(
        settings,
      );
    });
  });

  describe("selectTapeCopies", () => {
    it("should select tapeCopies from settings", () => {
      expect(
        fromSelectors.selectTapeCopies.projector(initialUserState.settings),
      ).toEqual("one");
    });
  });

  describe("selectTheme", () => {
    it("it should select darkTheme from settings", () => {
      expect(
        fromSelectors.selectTheme.projector(initialUserState.settings),
      ).toEqual(false);
    });
  });

  describe("selectIsLoggingIn", () => {
    it("should select isLoggingIn", () => {
      expect(
        fromSelectors.selectIsLoggingIn.projector(initialUserState),
      ).toEqual(false);
    });
  });

  describe("selectIsLoggedIn", () => {
    it("should select isLoggedIn", () => {
      expect(
        fromSelectors.selectIsLoggedIn.projector(initialUserState),
      ).toEqual(false);
    });
  });

  describe("selectIsLoading", () => {
    it("should select isLoading", () => {
      expect(fromSelectors.selectIsLoading.projector(initialUserState)).toEqual(
        false,
      );
    });
  });

  describe("selectColumns", () => {
    it("should select columns", () => {
      expect(fromSelectors.selectColumns.projector(initialUserState)).toEqual([
        { name: "datasetName", order: 1, type: "standard", enabled: true },
      ]);
    });
  });

  describe("selectSampleDialogPageViewModel", () => {
    it("should select sample dialog page view model state", () => {
      expect(
        fromSelectors.selectSampleDialogPageViewModel.projector(
          initialUserState.currentUser,
          initialUserState.profile,
        ),
      ).toEqual({ user, profile: userIdentity.profile });
    });
  });

  describe("selectLoginPageViewModel", () => {
    it("should select the login page view model state", () => {
      expect(
        fromSelectors.selectLoginPageViewModel.projector(
          initialUserState.isLoggedIn,
          initialUserState.isLoggingIn,
        ),
      ).toEqual({ isLoggedIn: false, isLoggingIn: false });
    });
  });

  describe("selectUserSettingsPageViewModel", () => {
    it("should select the user settings page view model state", () => {
      expect(
        fromSelectors.selectUserSettingsPageViewModel.projector(
          initialUserState.currentUser,
          initialUserState.profile,
          initialUserState.scicatToken.id,
          initialUserState.settings,
        ),
      ).toEqual({
        user,
        profile: userIdentity.profile,
        scicatToken: scicatToken.id,
        settings,
      });
    });
  });
});
