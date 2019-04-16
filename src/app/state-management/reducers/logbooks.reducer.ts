import { initialLogbookState, LogbookState } from "../state/logbooks.store";
import {
  ActionTypes,
  FetchLogbooksCompleteAction,
  LogbooksAction
} from "../actions/logbooks.actions";

export function logbooksReducer(
  state: LogbookState = initialLogbookState,
  action: LogbooksAction
): LogbookState {
  console.log("Action came in! " + action.type);
  switch (action.type) {
    case ActionTypes.FETCH_COMPLETE: {
      let logbooks = (action as FetchLogbooksCompleteAction).logbooks;
      logbooks.forEach(logbook => {
        let descendingMessages = logbook.messages.reverse();
        logbook.messages = descendingMessages;
      });
      return { ...state, logbooks };
    }
    default: {
      return state;
    }
  }
}
