import { Logbook, LogbookFilters } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  logbook: Logbook;

  filters: LogbookFilters;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  logbook: null,

  filters: {
    textSearch: "",
    showBotMessages: true,
    showUserMessages: true,
    showImages: true
  }
};
