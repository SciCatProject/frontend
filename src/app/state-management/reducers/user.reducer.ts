import { UserState, initialUserState } from "state-management/state/user.store";
import { Action, createReducer, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/user.actions";
import { getColumnOrder } from "state-management/selectors/user.selectors";

const reducer = createReducer(
  initialUserState,
  on(fromActions.loginAction, state => ({
    ...state,
    isLoggingIn: true,
    isLoggedIn: false
  })),

  on(fromActions.loginCompleteAction, (state, { user, accountType }) => ({
    ...state,
    currentUser: user,
    accountType,
    isLoggingIn: false,
    isLoggedIn: true
  })),
  on(fromActions.loginFailedAction, state => ({
    ...state,
    isLoggingIn: false,
    isLoggedIn: false
  })),

  on(fromActions.fetchCurrentUserCompleteAction, (state, { user }) => ({
    ...state,
    currentUser: user
  })),

  on(
    fromActions.fetchUserIdentityCompleteAction,
    (state, { userIdentity }) => ({
      ...state,
      profile: userIdentity.profile
    })
  ),

  on(fromActions.fetchCatamelTokenCompleteAction, (state, { token }) => ({
    ...state,
    catamelToken: token
  })),

  on(fromActions.logoutCompleteAction, () => ({
    ...initialUserState
  })),

  on(fromActions.selectColumnAction, (state, { column }) => {
    const currentColumns = state.displayedColumns;
    const displayedColumns = currentColumns.concat(column);
    const ordering = getColumnOrder();
    displayedColumns.sort((a, b) => ordering[a] - ordering[b]);
    return { ...state, displayedColumns };
  }),
  on(fromActions.deselectColumnAction, (state, { column }) => {
    const currentColumns = state.displayedColumns;
    const displayedColumns = currentColumns.filter(
      existingColumn => existingColumn !== column
    );
    return { ...state, displayedColumns };
  }),

  on(fromActions.showMessageAction, (state, { message }) => ({
    ...state,
    message
  })),
  on(fromActions.clearMessageAction, state => ({
    ...state,
    message: initialUserState.message
  })),

  on(fromActions.saveSettingsAction, (state, { settings }) => ({
    ...state,
    settings
  }))
);

export function userReducer(state: UserState | undefined, action: Action) {
  if (action.type.indexOf("[User]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
