import * as fromSelectors from "./user.selectors";

import { UserState } from "../state/user.store";
import { User, UserIdentity, Settings } from "../models";
import { AccessToken } from "../../shared/sdk";

const user: User = {
  id: "testId",
  realm: "testRealm",
  username: "testName",
  email: "test@email.com",
  emailVerified: true,
  password: "testPassword",
  accessTokens: [],
  identities: [],
  credentials: []
};

const userIdentity: UserIdentity = {
  id: "testId",
  user: user,
  provider: "testProvider",
  authScheme: "testScheme",
  externalId: "testId",
  credentials: null,
  userId: "testId",
  created: new Date(),
  modified: new Date(),
  profile: {
    id: "testId",
    displayName: "testName",
    email: "test@email.com",
    username: "testName",
    thumbnailPhoto: ""
  }
};

const catamelToken: AccessToken = {
  id: "testId",
  ttl: 100,
  scopes: ["string"],
  created: new Date(),
  userId: "testId",
  user: null
};

const settings: Settings = {
  tapeCopies: "one",
  datasetCount: 25,
  jobCount: 25,
  darkTheme: false
};

const initialUserState: UserState = {
  currentUser: user,
  profile: userIdentity.profile,
  accountType: "testType",

  catamelToken,

  settings,

  message: { content: undefined, type: undefined, duration: undefined },

  isLoggingIn: false,
  isLoggedIn: false,

  isLoading: false,

  columns: [{ name: "datasetName", order: 1, enabled: true }]
};

describe("User Selectors", () => {
  describe("getCurrentUser", () => {
    it("should get currentUser", () => {
      expect(fromSelectors.getCurrentUser.projector(initialUserState)).toEqual(
        user
      );
    });
  });

  describe("getCurrentUserId", () => {
    it("should get the id from currentUser", () => {
      expect(
        fromSelectors.getCurrentUserId.projector(initialUserState.currentUser)
      ).toEqual("testId");
    });
  });

  describe("getCurrentUserAccountType", () => {
    it("should get accountType", () => {
      expect(
        fromSelectors.getCurrentUserAccountType.projector(initialUserState)
      ).toEqual("testType");
    });
  });

  describe("getProfile", () => {
    it("should get profile", () => {
      expect(fromSelectors.getProfile.projector(initialUserState)).toEqual(
        userIdentity.profile
      );
    });
  });

  describe("getCurrentUserName", () => {
    it("should get the username either from profile or currentUser", () => {
      expect(
        fromSelectors.getCurrentUserName.projector(
          initialUserState.profile,
          initialUserState.currentUser
        )
      ).toEqual("testName");
    });
  });

  describe("getIsAdmin", () => {
    it("should return false if currentUser is not a functional account", () => {
      expect(
        fromSelectors.getIsAdmin.projector(
          initialUserState.currentUser.username,
          initialUserState.accountType
        )
      ).toEqual(false);
    });
  });

  describe("getCatamelToken", () => {
    it("should get catamelToken", () => {
      expect(fromSelectors.getCatamelToken.projector(initialUserState)).toEqual(
        catamelToken
      );
    });
  });

  describe("getSettings", () => {
    it("should get settings", () => {
      expect(fromSelectors.getSettings.projector(initialUserState)).toEqual(
        settings
      );
    });
  });

  describe("getTapeCopies", () => {
    it("should get tapeCopies from settings", () => {
      expect(
        fromSelectors.getTapeCopies.projector(initialUserState.settings)
      ).toEqual("one");
    });
  });

  describe("getTheme", () => {
    it("it should get darkTheme from settings", () => {
      expect(
        fromSelectors.getTheme.projector(initialUserState.settings)
      ).toEqual(false);
    });
  });

  describe("getIsLoggingIn", () => {
    it("should get isLoggingIn", () => {
      expect(fromSelectors.getIsLoggingIn.projector(initialUserState)).toEqual(
        false
      );
    });
  });

  describe("getIsLoggedIn", () => {
    it("should get isLoggedIn", () => {
      expect(fromSelectors.getIsLoggedIn.projector(initialUserState)).toEqual(
        false
      );
    });
  });

  describe("getIsLoading", () => {
    it("should get isLoading", () => {
      expect(fromSelectors.getIsLoading.projector(initialUserState)).toEqual(
        false
      );
    });
  });

  describe("getColumns", () => {
    it("should get columns", () => {
      expect(fromSelectors.getColumns.projector(initialUserState)).toEqual([
        { name: "datasetName", order: 1, enabled: true }
      ]);
    });
  });
});
