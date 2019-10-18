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

export const getConfigurableColumns = createSelector(
  getUserState,
  state => {
    const columns = [...state.columns];
    const index = columns.indexOf("select");
    if (index > -1) {
      columns.splice(index, 1);
    }
    return columns;
  }
);

export const getDisplayedColumns = createSelector(
  getUserState,
  state => state.displayedColumns
);

export const getColumnOrder = () => {
  // not ideal place for this, move to config file
  // logic may need to be made more robust
  const ordering = {
    datasetName: 2,
    runNumber: 3,
    sourceFolder: 4,
    size: 5,
    creationTime: 6,
    type: 7,
    image: 8,
    metadata: 9,
    proposalId: 10,
    ownerGroup: 11,
    dataStatus: 12
  };
  return ordering;
};
