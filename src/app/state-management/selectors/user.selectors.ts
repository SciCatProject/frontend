import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "state-management/state/user.store";

const selectUserState = createFeatureSelector<UserState>("users");

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser
);

export const selectCurrentUserId = createSelector(selectCurrentUser, (user) =>
  user ? user.id : ""
);

export const selectCurrentUserAccountType = createSelector(
  selectUserState,
  (state) => state.accountType
);

export const selectProfile = createSelector(
  selectUserState,
  (state) => state.profile
);

export const selectCurrentUserName = createSelector(
  selectProfile,
  selectCurrentUser,
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

export const selectIsAdmin = createSelector(
  selectCurrentUserName,
  selectCurrentUserAccountType,
  (name, type) =>
    name && ["admin", "archiveManager", "ingestor"].indexOf(name) !== -1
);

export const selectCatamelToken = createSelector(
  selectUserState,
  (state) => state.catamelToken.id
);

export const selectUserMessage = createSelector(
  selectUserState,
  (state) => state.message
);

export const selectSettings = createSelector(
  selectUserState,
  (state) => state.settings
);

export const selectTapeCopies = createSelector(
  selectSettings,
  (settings) => settings.tapeCopies
);

export const selectTheme = createSelector(
  selectSettings,
  (settings) => settings.darkTheme
);

export const selectIsLoggingIn = createSelector(
  selectUserState,
  (state) => state.isLoggingIn
);

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state) => state.isLoggedIn
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state) => state.isLoading
);

export const selectColumns = createSelector(
  selectUserState,
  (state) => state.columns
);
