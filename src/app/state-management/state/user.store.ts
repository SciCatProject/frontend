import { Settings, Message, User, AccessGroup } from "../models";

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: User;
  profile?: any;
  isLoggingIn: boolean;
  currentUserGroups: AccessGroup[];
  email: string;
  message: Message;
  settings: Settings;
  isLoggedIn: boolean;
  accountType?: string;
  columns: string[];
}

export const initialUserState: UserState = {
  currentUser: null,
  profile: null,
  currentUserGroups: [],
  email: undefined,
  isLoggingIn: false,
  message: { content: undefined, type: undefined, duration: undefined },
  settings: {
    tapeCopies: "one",
    datasetCount: 30,
    jobCount: 30,
    darkTheme: false
  }, // TODO sync with server settings?
  isLoggedIn: false,
  columns: [
    "size",
    "creationTime",
    "type",
    "image",
    "metadata",
    "proposalId",
    "ownerGroup",
    "archiveStatus",
    "retrieveStatus"
  ]
};
