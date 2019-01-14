import { Action } from "@ngrx/store";
import { initialUserState, UserState } from "state-management/state/user.store";

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
  DELETE_COLUMN,
  DELETE_COLUMN_COMPLETE,
  DeleteColumn,
  DeleteColumnComplete,
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
      return { ...state, currentUser };
    }

    case LOGIN_COMPLETE: {
      const {user, accountType} = action as LoginCompleteAction;
      return { ...state, currentUser: user, isLoggingIn: false, isLoggedIn: true, accountType };
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

    case DELETE_COLUMN: {
      return { ...state, deletingColumn: true };
    }

    case DELETE_COLUMN_COMPLETE : {
      const columns = state.columns;
      const columnName = (action as DeleteColumnComplete).columnName;
      const result = columns.filter(column => column !== columnName);
      console.log("array index", result);
      return {
        ...state, deletingColumn: false,
        columns:  result,
      };
    }

    default:
      return state;
  }
}

export const getEmail = (state: UserState) => state.email;
export const getCurrentUser = (state: UserState) => state.currentUser;
