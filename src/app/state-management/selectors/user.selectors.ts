import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "state-management/state/user.store";

const selectUserState = createFeatureSelector<UserState>("users");

export const selectCurrentUser = createSelector(
  selectUserState,
  (state) => state.currentUser,
);

export const selectCurrentUserId = createSelector(selectCurrentUser, (user) =>
  user ? user.id : "",
);

export const selectProfile = createSelector(
  selectUserState,
  (state) => state.profile,
);

export const selectCurrentUserName = createSelector(
  selectProfile,
  selectCurrentUser,
  (profile, user) => {
    if (profile) {
      return profile.displayName;
    } else if (user) {
      return user.username;
    } else {
      return null;
    }
  },
);

export const selectThumbnailPhoto = createSelector(selectProfile, (profile) => {
  if (
    profile &&
    profile.thumbnailPhoto &&
    profile.thumbnailPhoto.startsWith("data")
  ) {
    return profile.thumbnailPhoto;
  }

  return "assets/images/user.png";
});

export const selectIsAdmin = createSelector(
  selectCurrentUserName,
  (name) =>
    name && ["admin", "archiveManager", "ingestor"].indexOf(name) !== -1,
);

export const selectScicatToken = createSelector(
  selectUserState,
  (state) => state.scicatToken.id,
);

export const selectUserMessage = createSelector(
  selectUserState,
  (state) => state.message,
);

export const selectSettings = createSelector(
  selectUserState,
  (state) => state.settings,
);

export const selectTapeCopies = createSelector(
  selectSettings,
  (settings) => settings.tapeCopies,
);

export const selectTheme = createSelector(
  selectSettings,
  (settings) => settings.darkTheme,
);

export const selectIsLoggingIn = createSelector(
  selectUserState,
  (state) => state.isLoggingIn,
);

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state) => state.isLoggedIn,
);

export const selectIsLoading = createSelector(
  selectUserState,
  (state) => state.isLoading,
);

export const selectColumns = createSelector(
  selectUserState,
  (state) => state.columns,
);

export const selectTablesSettings = createSelector(
  selectUserState,
  (state) => state.tablesSettings,
);

export const selectFilters = createSelector(
  selectUserState,
  (state) => state.filters,
);

export const selectConditions = createSelector(
  selectUserState,
  (state) => state.conditions,
);

export const selectSampleDialogPageViewModel = createSelector(
  selectCurrentUser,
  selectProfile,
  (user, profile) => ({ user, profile }),
);

export const selectLoginPageViewModel = createSelector(
  selectIsLoggedIn,
  selectIsLoggingIn,
  (isLoggedIn, isLoggingIn) => ({ isLoggedIn, isLoggingIn }),
);

export const selectUserSettingsPageViewModel = createSelector(
  selectCurrentUser,
  selectProfile,
  selectScicatToken,
  selectSettings,
  (user, profile, scicatToken, settings) => ({
    user,
    profile,
    scicatToken,
    settings,
  }),
);

export const selectHasFetchedSettings = createSelector(
  selectUserState,
  (state) => state.hasFetchedSettings,
);

export const selectColumnsWithHasFetchedSettings = createSelector(
  selectUserState,
  (state) => ({
    columns: state.columns,
    hasFetchedSettings: state.hasFetchedSettings,
  }),
);
