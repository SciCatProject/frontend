import { Settings, Message, TableColumn } from "../models";
import { AccessTokenInterface } from "shared/services/auth/auth.service";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";
import {
  ConditionConfig,
  FilterConfig,
} from "../../shared/modules/filters/filters.module";

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: ReturnedUserDto | undefined;
  accountType?: string;
  profile?: any;

  scicatToken: AccessTokenInterface;

  settings: Settings;

  message: Message | undefined;

  isLoggingIn: boolean;
  isLoggedIn: boolean;

  hasFetchedSettings: boolean;

  isLoading: boolean;

  columns: TableColumn[];

  tablesSettings: object;

  filters: FilterConfig[];

  conditions: ConditionConfig[];
}

export const initialUserState: UserState = {
  currentUser: undefined,
  profile: null,

  scicatToken: {
    id: "",
    ttl: 0,
    scopes: ["string"],
    created: new Date(),
    userId: "",
    user: { id: "", username: "", email: "", authStrategy: "" },
  },

  settings: {
    tapeCopies: "one",
    datasetCount: 25,
    jobCount: 25,
    darkTheme: false,
  }, // TODO sync with server settings?

  message: undefined,

  isLoggingIn: false,
  isLoggedIn: false,

  isLoading: false,

  hasFetchedSettings: false,

  columns: [],

  filters: [
    { LocationFilter: true },
    { PidFilter: true },
    { GroupFilter: true },
    { TypeFilter: true },
    { KeywordFilter: true },
    { DateRangeFilter: true },
    { TextFilter: true },
  ],

  conditions: [],

  tablesSettings: {},
};
