import { initialLogbookState, LogbookState } from "../state/logbooks.store";
import {
  ActionTypes,
  FetchLogbooksCompleteAction,
  LogbooksAction,
  FetchLogbookCompleteAction,
  FetchFilteredLogbookCompleteAction
} from "../actions/logbooks.actions";
import { Logbook } from "shared/sdk";

export function logbooksReducer(
  state: LogbookState = initialLogbookState,
  action: LogbooksAction
): LogbookState {
  console.log("Action came in! " + action.type);
  switch (action.type) {
    case ActionTypes.FETCH_LOGBOOKS_COMPLETE: {
      let logbooks = (action as FetchLogbooksCompleteAction).logbooks;
      logbooks.forEach(logbook => {
        let descendingMessages = logbook.messages.reverse();
        logbook.messages = descendingMessages;
      });
      return { ...state, logbooks };
    }
    case ActionTypes.FETCH_LOGBOOK_COMPLETE: {
      let logbook = (action as FetchLogbookCompleteAction).logbook;
      formatImageUrls(logbook);
      return { ...state, logbook };
    }
    case ActionTypes.FETCH_FILTERED_LOGBOOK_COMPLETE: {
      let logbook = (action as FetchFilteredLogbookCompleteAction).logbook;
      formatImageUrls(logbook);
      return { ...state, logbook };
    }
    default: {
      return state;
    }
  }
}

function formatImageUrls(logbook: Logbook) {
  logbook.messages.forEach(message => {
    if (message.content.msgtype === "m.image") {
      let externalThumbnailUrl = message.content.info.thumbnail_url.replace(
        "mxc://",
        "https://scicat03.esss.lu.se:8448/_matrix/media/r0/download/"
      );
      message.content.info.thumbnail_url = externalThumbnailUrl;
      let externalFullsizeUrl = message.content.url.replace(
        "mxc://",
        "https://scicat03.esss.lu.se:8448/_matrix/media/r0/download/"
      );
      message.content.url = externalFullsizeUrl;
    }
  });
}
