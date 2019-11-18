import { Logbook, LogbookFilters } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  currentLogbook: Logbook;

  hasPrefilledFilters: boolean;
  filters: LogbookFilters;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  currentLogbook: null,

  hasPrefilledFilters: false,
  filters: {
    textSearch: "",
    showBotMessages: true,
    showUserMessages: true,
    showImages: true
  }
};
