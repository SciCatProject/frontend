import { Logbook, LogbookFilters } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  currentLogbook: Logbook;

  totalCount: number;

  hasPrefilledFilters: boolean;
  filters: LogbookFilters;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: null,

  totalCount: 0,

  hasPrefilledFilters: false,
  filters: {
    textSearch: "",
    showBotMessages: true,
    showUserMessages: true,
    showImages: true,
    skip: 0,
    limit: 25
  }
};
