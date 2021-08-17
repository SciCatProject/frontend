import { Settings, Message, User, TableColumn } from "../models";
import { AccessToken } from "shared/sdk";
import { APP_DI_CONFIG } from "app-config.module";

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: User | undefined;
  accountType?: string;
  profile?: any;

  catamelToken: AccessToken | undefined;

  settings: Settings;

  message: Message | undefined;

  isLoggingIn: boolean;
  isLoggedIn: boolean;

  isLoading: boolean;

  columns: TableColumn[];
}

export const initialUserState: UserState = {
  currentUser: undefined,
  profile: null,

  catamelToken: undefined,

  settings: {
    tapeCopies: "one",
    datasetCount: 25,
    jobCount: 25,
    darkTheme: false
  }, // TODO sync with server settings?

  message: undefined,

  isLoggingIn: false,
  isLoggedIn: false,

  isLoading: false,

  columns: APP_DI_CONFIG.localColumns
};
