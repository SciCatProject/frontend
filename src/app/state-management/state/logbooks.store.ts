import { Logbook } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
  logbook: Logbook;
}

export const initialLogbookState: LogbookState = {
  logbooks: [],
  logbook: null
};
