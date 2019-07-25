import { Action } from "@ngrx/store";
import { initialUserState, UserState } from "state-management/state/user.store";
import {
  getColumnOrder as getColumnOrderList
} from "../../state-management/selectors/users.selectors";

import {
  SHOW_MESSAGE,
  CLEAR_MESSAGE,
  SAVE_SETTINGS,
  LOGIN,
  LOGIN_COMPLETE,
  LOGIN_FAILED,
  RETRIEVE_USER_COMPLETE,
  RetrieveUserCompleteAction,
  LOGOUT_COMPLETE,
  LoginCompleteAction,
  ShowMessageAction,
  SaveSettingsAction,
  DESELECT_COLUMN,
  DESELECT_COLUMN_COMPLETE,
  SELECT_COLUMN,
  SELECT_COLUMN_COMPLETE,
  DeselectColumnCompleteAction,
  SelectColumnCompleteAction,
  RETRIEVE_USER_IDENTITY_COMPLETE,
  RetrieveUserIdentCompleteAction
} from "state-management/actions/user.actions";

export function userReducer(
  state = initialUserState,
  action: Action
): UserState {
  if (action.type.indexOf("[User]") !== -1) {
    console.log("Action came in! " + action.type);
  }

  switch (action.type) {
    case RETRIEVE_USER_COMPLETE: {
      const currentUser = (action as RetrieveUserCompleteAction).user;
      const isLoggedIn = true;
      return { ...state, currentUser, isLoggedIn };
    }

    case LOGIN_COMPLETE: {
      const { user, accountType } = action as LoginCompleteAction;
      return {
        ...state,
        currentUser: user,
        isLoggingIn: false,
        isLoggedIn: true,
        accountType
      };
    }

    case LOGIN_FAILED: {
      return { ...state, isLoggingIn: false, isLoggedIn: false };
    }

    case SHOW_MESSAGE: {
      const message = (action as ShowMessageAction).message;
      return { ...state, message };
    }

    case CLEAR_MESSAGE: {
      return { ...state, message: initialUserState.message };
    }

    case SAVE_SETTINGS: {
      const settings = (action as SaveSettingsAction).values;
      return { ...state, settings };
    }

    case LOGOUT_COMPLETE: {
      return { ...initialUserState, currentUser: null };
    }

    case LOGIN: {
      return { ...state, isLoggingIn: true };
    }

    case SELECT_COLUMN: {
      return { ...state, selectingColumn: true };
    }

    case SELECT_COLUMN_COMPLETE: {
      const displayedColumns = state.displayedColumns;
      const columnName = (action as SelectColumnCompleteAction).columnName;
      const result = displayedColumns.concat(columnName);
      const ordering = getColumnOrderList();
      result.sort(function(a, b) { return ordering[a] - ordering[b]; });
      return {
        ...state,
        selectingColumn: false,
        displayedColumns: result
      };
    }

    case DESELECT_COLUMN: {
      return { ...state, deletingColumn: true };
    }

    case DESELECT_COLUMN_COMPLETE: {
      const displayedColumns = state.displayedColumns;
      const columnName = (action as DeselectColumnCompleteAction).columnName;
      const result = displayedColumns.filter(column => column !== columnName);
      return {
        ...state,
        deletingColumn: false,
        displayedColumns: result
      };
    }

    case RETRIEVE_USER_IDENTITY_COMPLETE: {
      const userIdentity = (action as RetrieveUserIdentCompleteAction).userIdentity;
      return { ...state, profile: userIdentity.profile };
    }

    default:
      return state;
  }
}

export const getEmail = (state: UserState) => state.email;
export const getCurrentUser = (state: UserState) => state.currentUser;
