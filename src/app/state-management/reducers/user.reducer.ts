import {Action} from '@ngrx/store';
import {initialUserState, UserState} from 'state-management/state/user.store';
import * as ua from 'state-management/actions/user.actions';

export function userReducer(state = initialUserState, action: Action): UserState {

  if (action.type.indexOf('[User]') !== -1) {
    console.log('Action came in! ' + action.type);
  }
  switch (action.type) {

    case ua.LOGIN: {
      return state;
    }

    case ua.RETRIEVE_USER_COMPLETE: {
      // TODO check why susbcription does not receive this
      const s = Object.assign({}, state, { currentUser: action['payload'] });
      return s;
    }

    case ua.LOGIN_COMPLETE: {
      const s = Object.assign({}, state, { currentUser: action['payload']['user'] });
      return s;
    }

    case ua.AD_LOGIN_COMPLETE: {
        return state;
    }

    case ua.ACCESS_USER_EMAIL_COMPLETE: {
        const c = state.currentUser;
        c['accessEmail'] = action['payload'];
        return Object.assign({}, state, { currentUser: c });
    }

    case ua.LOGIN_FAILED: {
      const err = action['payload'];
      const s = Object.assign({}, state, { currentUser: err });

      return s;
    }

    case ua.SHOW_MESSAGE: {
      const m = action['payload'];
      const s = Object.assign({}, state, {message: m});
      return s;
    }

    case ua.CLEAR_MESSAGE: {
      return Object.assign({}, state, {message: initialUserState.message});
    }

    case ua.SAVE_SETTINGS: {
      return Object.assign({}, state, {settings: action['payload']});
    }

    case ua.LOGOUT_COMPLETE: {
      const s = initialUserState;
      s.currentUser['loggedOut'] = true;
      return s;
    }

    case ua.ADD_GROUPS_COMPLETE: {
      return Object.assign({}, state, {currentUserGroups: action['payload']});
    }

    case ua.ACCESS_USER_EMAIL_COMPLETE: {
        return state;
    }

    default: {
      return state;
    }
  }
}
