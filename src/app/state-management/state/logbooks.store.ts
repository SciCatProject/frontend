import { Logbook, LogbookFilters } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  currentLogbook: Logbook;

  filters: LogbookFilters;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: null,

  filters: {
    textSearch: "",
    showBotMessages: true,
    showUserMessages: true,
    showImages: true
  }
};
