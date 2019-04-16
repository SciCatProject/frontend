import { Logbook } from "state-management/models";

export interface LogbookState {
  logbooks: Logbook[];
}

export const initialLogbookState: LogbookState = {
  logbooks: []
};
