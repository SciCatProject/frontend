import { Settings, Message, User, TableColumn } from "../models";
import { AccessToken } from "shared/sdk";
import { APP_DI_CONFIG } from "app-config.module";

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: User;
  accountType?: string;
  profile?: any;

  catamelToken: AccessToken;

  settings: Settings;

  message: Message;

  isLoggingIn: boolean;
  isLoggedIn: boolean;

  isLoading: boolean;

  columns: TableColumn[];
}

export const initialUserState: UserState = {
  currentUser: null,
  profile: null,

  catamelToken: null,

  settings: {
    tapeCopies: "one",
    datasetCount: 25,
    jobCount: 25,
    darkTheme: false
  }, // TODO sync with server settings?

  message: { content: undefined, type: undefined, duration: undefined },

  isLoggingIn: false,
  isLoggedIn: false,

  isLoading: false,

  columns: APP_DI_CONFIG.localColumns
};
