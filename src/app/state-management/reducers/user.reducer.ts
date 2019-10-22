import { UserState, initialUserState } from "state-management/state/user.store";
import { Action, createReducer, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/user.actions";

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
    currentUser: user,
    isLoggedIn: true
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
    const columns = [...state.columns];
    columns.forEach(item => {
      if (item.name === column) {
        item.enabled = true;
      }
    });
    return { ...state, columns };
  }),
  on(fromActions.deselectColumnAction, (state, { column }) => {
    const columns = [...state.columns];
    columns.forEach(item => {
      if (item.name === column) {
        item.enabled = false;
      }
    });
    return { ...state, columns };
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
  })),

  on(fromActions.loadingAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.loadingCompleteAction, state => ({
    ...state,
    isLoading: false
  }))
);

export function userReducer(state: UserState | undefined, action: Action) {
  if (action.type.indexOf("[User]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
