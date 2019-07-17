import { initialLogbookState, LogbookState } from "../state/logbooks.store";
import {
  ActionTypes,
  FetchLogbooksCompleteAction,
  FetchLogbookCompleteAction,
  FetchFilteredEntriesCompleteAction,
  UpdateFilterCompleteAction,
  AllActions
} from "../actions/logbooks.actions";
import { Logbook } from "shared/sdk";

export function logbooksReducer(
  state: LogbookState = initialLogbookState,
  action: AllActions
): LogbookState {
  if (action.type.indexOf("[Logbook]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  switch (action.type) {
    case ActionTypes.FETCH_LOGBOOKS_COMPLETE: {
      const logbooks = (action as FetchLogbooksCompleteAction).logbooks;
      if (logbooks) {
        logbooks.forEach(logbook => {
          const descendingMessages = logbook.messages.reverse();
          logbook.messages = descendingMessages;
        });
      }
      return { ...state, logbooks };
    }
    case ActionTypes.FETCH_LOGBOOK_COMPLETE: {
      const logbook = (action as FetchLogbookCompleteAction).logbook;
      formatImageUrls(logbook);
      return { ...state, logbook };
    }
    case ActionTypes.FETCH_FILTERED_ENTRIES_COMPLETE: {
      const logbook = (action as FetchFilteredEntriesCompleteAction).logbook;
      formatImageUrls(logbook);
      return { ...state, logbook };
    }
    case ActionTypes.UPDATE_FILTER_COMPLETE: {
      const filters = (action as UpdateFilterCompleteAction).filter;
      return { ...state, filters };
    }
    default: {
      return state;
    }
  }
}

function formatImageUrls(logbook: Logbook) {
  if (logbook && logbook.messages) {
    logbook.messages.forEach(message => {
      if (message.content.msgtype === "m.image") {
        if (message.content.info.hasOwnProperty("thumbnail_url")) {
          const externalThumbnailUrl = message.content.info.thumbnail_url.replace(
            "mxc://",
            "https://scicat03.esss.lu.se:8448/_matrix/media/r0/download/"
          );
          message.content.info.thumbnail_url = externalThumbnailUrl;
        }
        if (message.content.hasOwnProperty("url")) {
          const externalFullsizeUrl = message.content.url.replace(
            "mxc://",
            "https://scicat03.esss.lu.se:8448/_matrix/media/r0/download/"
          );
          message.content.url = externalFullsizeUrl;
        }
      }
    });
  }
}
