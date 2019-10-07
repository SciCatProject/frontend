import { Logbook, LogbookFilters } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  currentLogbook: Logbook;

  isLoading: boolean;

  filters: LogbookFilters;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: null,

  isLoading: false,

  filters: {
    textSearch: "",
    showBotMessages: true,
    showUserMessages: true,
    showImages: true
  }
};
