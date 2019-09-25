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
  user => (user ? user.email : null)
);

export const getCurrentUserId = createSelector(
  getCurrentUser,
  user => (user ? user.id : null)
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

export const getColumnOrder = function() {
  // not ideal place for this, move to config file
  // logic may need to be made more robust
  const ordering = {
    datasetName: 2,
    sourceFolder: 3,
    size: 4,
    creationTime: 5,
    type: 6,
    image: 7,
    metadata: 8,
    proposalId: 9,
    ownerGroup: 10,
    dataStatus: 11
  };
  return ordering;
};

export const getConfigurableColumns = createSelector(
  getUserState,
  state => {
    const columns = state.columns;
    const index = columns.indexOf("select");
    if (index > -1) {
      columns.splice(index, 1);
    }
    return columns;
  }
);

export const getState = (state: any) => state.root.user;

export const getLoading = (state: any) => state.root.user.loading;
export const getCurrentUserGroups = (state: any) =>
  state.root.user.currentUserGroups;
export const getTheme = (state: any) => state.root.user.settings.darkTheme;

export const getProfile = createSelector(
  getUserState,
  state => state.profile
);

export const getCatamelToken = createSelector(
  getUserState,
  state => state.catamelToken
);
