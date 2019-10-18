import { createReducer, on, Action } from "@ngrx/store";
import {
  initialLogbookState,
  LogbookState
} from "state-management/state/logbooks.store";
import * as fromActions from "state-management/actions/logbooks.actions";
import { Logbook } from "shared/sdk";
import { APP_DI_CONFIG } from "app-config.module";

const reducer = createReducer(
  initialLogbookState,
  on(fromActions.fetchLogbooksCompleteAction, (state, { logbooks }) => {
    if (logbooks) {
      logbooks.forEach(logbook => {
        const descendingMessages = logbook.messages.reverse();
        logbook.messages = descendingMessages;
      });
    }
    return { ...state, logbooks };
  }),

  on(fromActions.fetchLogbookCompleteAction, (state, { logbook }) => {
    const currentLogbook = formatImageUrls(logbook);
    return { ...state, currentLogbook };
  }),

  on(fromActions.fetchFilteredEntriesCompleteAction, (state, { logbook }) => {
    const currentLogbook = formatImageUrls(logbook);
    return { ...state, currentLogbook };
  }),

  on(fromActions.setFilterAction, (state, { filters }) => ({
    ...state,
    filters
  }))
);

export function logbooksReducer(
  state: LogbookState | undefined,
  action: Action
) {
  if (action.type.indexOf("[Logbook]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}

export function formatImageUrls(logbook: Logbook): Logbook {
  if (logbook && logbook.messages) {
    const logbookCopy = { ...logbook } as Logbook;
    logbookCopy.messages.forEach(message => {
      if (message.content.msgtype === "m.image") {
        if (message.content.info.hasOwnProperty("thumbnail_url")) {
          const externalThumbnailUrl = message.content.info.thumbnail_url.replace(
            "mxc://",
            `${APP_DI_CONFIG.synapseBaseUrl}/_matrix/media/r0/download/`
          );
          message.content.info.thumbnail_url = externalThumbnailUrl;
        }
        if (message.content.hasOwnProperty("url")) {
          const externalFullsizeUrl = message.content.url.replace(
            "mxc://",
            `${APP_DI_CONFIG.synapseBaseUrl}/_matrix/media/r0/download/`
          );
          message.content.url = externalFullsizeUrl;
        }
      }
    });
    return logbookCopy;
  } else {
    return logbook;
  }
}
