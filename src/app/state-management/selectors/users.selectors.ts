import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserState } from "../state/user.store";

const getUserState = createFeatureSelector<UserState>("users");

export const getCurrentUser = createSelector(
  getUserState,
  state => state.currentUser || null
);

export const getIsLoggedIn = createSelector(
  getUserState,
  state => state.isLoggedIn
);

export const getCurrentEmail = createSelector(
  getCurrentUser,
  user => user ? user.email : null
);

export const getCurrentUserId = createSelector(
  getCurrentUser,
  user => user ? user.id : null
);

export const getSettings = createSelector(
  getUserState,
  state => state.settings
);

export const getTapeCopies = createSelector(
  getSettings,
  settings => settings.tapeCopies
);

export const getCurrentUserName = createSelector(
  getUserState,
  user => {
    if (!user) {
      return null;
    }
    if (user.profile) {
      return user.profile.username;
    } else if (user.currentUser) {
      return user.currentUser.username;
    }
    return null;
  }
);

export const getCurrentUserAccountType = createSelector(
  getUserState,
  state => state.accountType
);

export const getIsAdmin = createSelector(
  getCurrentUserName,
  getCurrentUserAccountType,
  (name, type) =>
    (name && ["ingestor", "admin", "archiveManager"].indexOf(name) !== -1) ||
    (type && type === "functional")
);

export const getIsLoggingIn = createSelector(
  getUserState,
  state => state.isLoggingIn
);

export const getColumns = createSelector(
  getUserState,
  state => state.columns
);

export const getDisplayedColumns = createSelector(
  getUserState,
  state => state.displayedColumns
);

export const getState = (state: any) => state.root.user;

export const getLoading = (state: any) => state.root.user.loading;
export const getCurrentUserGroups = (state: any) =>
  state.root.user.currentUserGroups;
export const getTheme = (state: any) => state.root.user.settings.darkTheme;

export const getProfile = createSelector(
  getUserState,
  user => user.profile ? user.profile : null
);
