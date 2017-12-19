import * as lb from 'shared/sdk/models';

interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
}

interface Message {
  content: string;
  title: string;
  type: string;
}

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: lb.User;
  currentUserGroups: lb.AccessGroup[];
  email: string;
  message: Message;
  settings: Settings;
  }

export const initialUserState: UserState = {
  currentUser : <lb.User>{},
  currentUserGroups : [],
  email : undefined,
  message : {'content' : undefined, 'title' : undefined, type : undefined},
  settings : {
    'tapeCopies' : 'one',
    'datasetCount' : 30,
    'jobCount' : 30,
    'darkTheme' : false
  } // TODO sync with server settings?
};
