import { createReducer, Action, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/users.actions";
import {
  UsersState,
  initialUsersState,
} from "state-management/state/users.store";

const reducer = createReducer(
  initialUsersState,
  on(fromActions.loadUsers, (state): UsersState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    fromActions.loadUsersSuccess,
    (state, { users }): UsersState => ({
      ...state,
      users,
      loading: false,
      error: null,
    }),
  ),

  on(
    fromActions.loadUsersFailure,
    (state, { error }): UsersState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);

export const usersReducer = (state: UsersState | undefined, action: Action) =>
  reducer(state, action);
