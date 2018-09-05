import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserState } from "../state/user.store";
import { getEmail } from "../reducers/user.reducer";

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

const getCurrentUserName = createSelector(
  getCurrentUser,
  user => user ? user.username : null
);

const getCurrentUserAccountType = createSelector(
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

export const getState = (state: any) => state.root.user;
// export const getCurrentUser = (state: any) => state.root.user.currentUser;
export const getLoading = (state: any) => state.root.user.loading;
export const getCurrentUserGroups = (state: any) =>
  state.root.user.currentUserGroups;
export const getSettings = (state: any) => state.root.user.settings;
export const getTapeCopies = (state: any) =>
  state.root.user.settings.tapeCopies;
export const getTheme = (state: any) => state.root.user.settings.darkTheme;
