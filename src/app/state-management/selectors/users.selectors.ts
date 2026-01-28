import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UsersState } from "state-management/state/users.store";

const selectUsersState = createFeatureSelector<UsersState>("usersList");

export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users,
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading,
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error,
);
