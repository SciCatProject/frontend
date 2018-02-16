import { Action } from '@ngrx/store';
import { initialUserState, UserState } from 'state-management/state/user.store';

import {
    SHOW_MESSAGE,
    CLEAR_MESSAGE,
    SAVE_SETTINGS,

    LOGIN, LOGIN_COMPLETE, LOGIN_FAILED,
    RETRIEVE_USER_COMPLETE, RetrieveUserCompleteAction,

    ACCESS_USER_EMAIL_COMPLETE,
    AD_LOGIN_COMPLETE,
    LOGOUT_COMPLETE,
    ADD_GROUPS_COMPLETE
} from 'state-management/actions/user.actions';

export function userReducer(state = initialUserState, action: Action): UserState {
    if (action.type.indexOf('[User]') !== -1) {
        console.log('Action came in! ' + action.type);
    }

    switch (action.type) {
        case RETRIEVE_USER_COMPLETE: {
            // TODO check why susbcription does not receive this
            const currentUser = action['payload'];
            return {...state, currentUser};
        }

        case LOGIN_COMPLETE: {
            const currentUser = action['payload']['user'];
            return {...state, currentUser};
        }

        case ACCESS_USER_EMAIL_COMPLETE: {
            // const c = state.currentUser;
            // c['email'] = action['payload'];
            return {...state, email: action['payload']};
        }

        case LOGIN_FAILED: {
            const err = action['payload'];
            return {...state, currentUser: err};
        }

        case SHOW_MESSAGE: {
            const message = action['payload'];
            return {...state, message};
        }

        case CLEAR_MESSAGE: {
            return {...state, message: initialUserState.message};
        }

        case SAVE_SETTINGS: {
            const settings = action['payload'];
            return {...state, settings};
        }

        case LOGOUT_COMPLETE: {
            const initialCurrentUser = {...initialUserState.currentUser, loggedOut: true};
            return {...initialUserState, currentUser: initialCurrentUser};
        }

        case ADD_GROUPS_COMPLETE: {
            const currentUserGroups = action['payload'];
            return {...state, currentUserGroups};
        }

        case LOGIN:
        case AD_LOGIN_COMPLETE:
        case ACCESS_USER_EMAIL_COMPLETE:
        default: {
            return state;
        }
    }
}

export const getEmail = (state: UserState) => state.email;
export const getCurrentUser = (state: UserState) => state.currentUser;
