import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "state-management/state/user.store";

const getUserState = createFeatureSelector<UserState>("users");

export const getCurrentUser = createSelector(
  getUserState,
  state => state.currentUser
);

export const getCurrentUserId = createSelector(
  getCurrentUser,
  user => user.id
);

export const getCurrentUserAccountType = createSelector(
  getUserState,
  state => state.accountType
);

export const getProfile = createSelector(
  getUserState,
  state => state.profile
);

export const getCurrentUserName = createSelector(
  getProfile,
  getCurrentUser,
  (profile, user) => {
    if (profile) {
      return profile.username;
    } else if (user) {
      return user.username;
    } else {
      return null;
    }
  }
);

export const getIsAdmin = createSelector(
  getCurrentUserName,
  getCurrentUserAccountType,
  (name, type) =>
    (name && ["ingestor", "admin", "archiveManager"].indexOf(name) !== -1) ||
    (type && type === "functional")
);

export const getCatamelToken = createSelector(
  getUserState,
  state => state.catamelToken
);

export const getSettings = createSelector(
  getUserState,
  state => state.settings
);

export const getTapeCopies = createSelector(
  getSettings,
  settings => settings.tapeCopies
);

export const getTheme = createSelector(
  getSettings,
  settings => settings.darkTheme
);

export const getIsLoggingIn = createSelector(
  getUserState,
  state => state.isLoggingIn
);

export const getIsLoggedIn = createSelector(
  getUserState,
  state => state.isLoggedIn
);

export const getIsLoading = createSelector(
  getUserState,
  state => state.isLoading
);

export const getColumns = createSelector(
  getUserState,
  state => state.columns
);
