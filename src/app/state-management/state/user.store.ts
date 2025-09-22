import { Settings, Message, TableColumn, ScientificCondition } from "../models";
import { AccessTokenInterface } from "shared/services/auth/auth.service";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";
import { Observable } from "rxjs";
import { FacetCount } from "./datasets.store";

export type FilterType = "text" | "dateRange" | "multiSelect" | "number";

export interface FilterConfig {
  key: string;
  label: string;
  description?: string;
  type?: FilterType;
  enabled: boolean;
  facetCounts$?: Observable<FacetCount[]>;
  filter$?: Observable<string[]>;
}

export interface ConditionConfig {
  condition: ScientificCondition;
  enabled: boolean;
}

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
    created: new Date().toISOString(),
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
    {
      key: "creationLocation",
      label: "Location",
      type: "multiSelect",
      description: "Filter by creation location on the dataset",
      enabled: true,
    },
    {
      key: "pid",
      label: "Pid",
      type: "text",
      description: "Filter by dataset pid",
      enabled: true,
    },
    {
      key: "ownerGroup",
      label: "Group",
      type: "multiSelect",
      description: "Filter by owner group of the dataset",
      enabled: true,
    },
    {
      key: "type",
      label: "Type",
      type: "multiSelect",
      description: "Filter by dataset type",
      enabled: true,
    },
    {
      key: "keywords",
      label: "Keyword",
      type: "multiSelect",
      description: "Filter by keywords in the dataset",
      enabled: true,
    },
    {
      key: "creationTime",
      label: "Creation Time",
      type: "dateRange",
      description: "Filter by creation time of the dataset",
      enabled: true,
    },
  ],

  conditions: [],

  tablesSettings: {},
};
