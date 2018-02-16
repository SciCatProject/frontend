import {
  Settings, Message,
  User, AccessGroup
} from '../models';

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: User;
  currentUserGroups: AccessGroup[];
  email: string;
  message: Message;
  settings: Settings;
}

export const initialUserState: UserState = {
  currentUser: <User>{},
  currentUserGroups: [],
  email: undefined,
  message: {content: undefined, type: undefined, duration: 10000},
  settings: {
    'tapeCopies': 'one',
    'datasetCount': 30,
    'jobCount': 30,
    'darkTheme': false
  } // TODO sync with server settings?
};
