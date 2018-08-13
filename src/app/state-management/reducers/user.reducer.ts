import { Action } from '@ngrx/store';
import { initialUserState, UserState } from 'state-management/state/user.store';
import {switchMap} from 'rxjs/operators';

import {
    SHOW_MESSAGE,
    CLEAR_MESSAGE,
    SAVE_SETTINGS,
    LOGIN, LOGIN_COMPLETE, LOGIN_FAILED,
    RETRIEVE_USER_COMPLETE, RetrieveUserCompleteAction,
    ACCESS_USER_EMAIL_COMPLETE,
    AD_LOGIN_COMPLETE,
    LOGOUT_COMPLETE,
    LoginCompleteAction,
    AccessUserEmailCompleteAction,
    ShowMessageAction,
    SaveSettingsAction
} from 'state-management/actions/user.actions';

export function userReducer(state = initialUserState, action: Action): UserState {
    if (action.type.indexOf('[User]') !== -1) {
        console.log('Action came in! ' + action.type);
    }

    switch (action.type) {
        case RETRIEVE_USER_COMPLETE: {
            // TODO check why susbcription does not receive this
            const currentUser = (action as RetrieveUserCompleteAction).user;
            return {...state, currentUser};
        }

        case LOGIN_COMPLETE: {
            const currentUser = (action as LoginCompleteAction).user;
            return {...state, currentUser, isLoggingIn: false};
        }

        case ACCESS_USER_EMAIL_COMPLETE: {
            // const c = state.currentUser;
            // c['email'] = action['payload'];
            return {...state, email: (action as AccessUserEmailCompleteAction).email};
        }

        case LOGIN_FAILED: {
            return {...state, isLoggingIn: false};
        }

        case SHOW_MESSAGE: {
            const message = (action as ShowMessageAction).message;
            return {...state, message};
        }

        case CLEAR_MESSAGE: {
            return {...state, message: initialUserState.message};
        }

        case SAVE_SETTINGS: {
            const settings = (action as SaveSettingsAction).values;
            return {...state, settings};
        }

        case LOGOUT_COMPLETE: {
            return {...initialUserState, currentUser: null};
        }

        case LOGIN: {
            return {...state, isLoggingIn: true};
        }
        case AD_LOGIN_COMPLETE:
        default: {
            return state;
        }
    }
}

export const getEmail = (state: UserState) => state.email;
export const getCurrentUser = (state: UserState) => state.currentUser;
