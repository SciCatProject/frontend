import { Logbook } from "@scicatproject/scicat-sdk-ts-angular";
import { LogbookFilters } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  currentLogbook: any | undefined;

  totalCount: number;

  hasPrefilledFilters: boolean;
  filters: LogbookFilters;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: undefined,

  totalCount: 0,

  hasPrefilledFilters: false,
  filters: {
    textSearch: "",
    showBotMessages: true,
    showUserMessages: true,
    showImages: true,
    sortField: "timestamp:desc",
    skip: 0,
    limit: 25,
  },
};
