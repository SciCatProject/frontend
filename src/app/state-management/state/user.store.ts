import { Settings, Message, User, TableColumn } from "../models";
import { AccessToken } from "shared/sdk";
import {
  ConditionConfig,
  FilterConfig,
} from "../../shared/modules/filters/filters.module";
import { LocationFilterComponent } from "../../shared/modules/filters/location-filter.component";
import { PidFilterComponent } from "../../shared/modules/filters/pid-filter.component";
import { PidFilterContainsComponent } from "../../shared/modules/filters/pid-filter-contains.component";
import { PidFilterStartsWithComponent } from "../../shared/modules/filters/pid-filter-startsWith.component";
import { GroupFilterComponent } from "../../shared/modules/filters/group-filter.component";
import { TypeFilterComponent } from "../../shared/modules/filters/type-filter.component";
import { KeywordFilterComponent } from "../../shared/modules/filters/keyword-filter.component";
import { DateRangeFilterComponent } from "../../shared/modules/filters/date-range-filter.component";
import { TextFilterComponent } from "../../shared/modules/filters/text-filter.component";

// NOTE It IS ok to make up a state of other sub states
export interface UserState {
  currentUser: User | undefined;
  accountType?: string;
  profile?: any;

  scicatToken: AccessToken;

  settings: Settings;

  message: Message | undefined;

  isLoggingIn: boolean;
  isLoggedIn: boolean;

  isLoading: boolean;

  columns: TableColumn[];

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
    user: {},
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

  columns: [],

  filters: [
    { type: "LocationFilterComponent", visible: true },
    { type: "PidFilterComponent", visible: true },
    { type: "PidFilterContainsComponent", visible: false },
    { type: "PidFilterStartsWithComponent", visible: false },
    { type: "GroupFilterComponent", visible: true },
    { type: "TypeFilterComponent", visible: true },
    { type: "KeywordFilterComponent", visible: true },
    { type: "DateRangeFilterComponent", visible: true },
  ],

  conditions: [],
};
