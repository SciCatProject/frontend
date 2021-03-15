import { createReducer, on, Action } from "@ngrx/store";
import {
  initialLogbookState,
  LogbookState,
} from "state-management/state/logbooks.store";
import * as fromActions from "state-management/actions/logbooks.actions";
import { Logbook } from "shared/sdk";
import { APP_DI_CONFIG } from "app-config.module";

const reducer = createReducer(
  initialLogbookState,
  on(fromActions.fetchLogbooksCompleteAction, (state, { logbooks }) => {
    const formattedLogbooks = logbooks.map((logbook) => {
      const descendingMessages = logbook.messages.reverse();
      logbook.messages = descendingMessages;
      return formatImageUrls(logbook);
    });
    return { ...state, logbooks: formattedLogbooks };
  }),

  on(fromActions.fetchLogbookCompleteAction, (state, { logbook }) => {
    const currentLogbook = formatImageUrls(logbook);
    return { ...state, currentLogbook };
  }),
  on(fromActions.fetchLogbookFailedAction, (state) => {
    return { ...state, currentLogbook: null };
  }),

  on(fromActions.clearLogbookAction, (state) => {
    return { ...state, currentLogbook: null };
  }),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count,
  })),

  on(fromActions.prefillFiltersAction, (state, { values }) => {
    const filters = { ...state.filters, ...values };
    return { ...state, filters, hasPrefilledFilters: true };
  }),

  on(fromActions.setTextFilterAction, (state, { textSearch }) => {
    const filters = { ...state.filters, textSearch, skip: 0 };
    return { ...state, filters };
  }),

  on(
    fromActions.setDisplayFiltersAction,
    (state, { showBotMessages, showImages, showUserMessages }) => {
      const filters = {
        ...state.filters,
        showBotMessages,
        showImages,
        showUserMessages,
        skip: 0,
      };
      return { ...state, filters };
    }
  ),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? ":" + direction : "");
    const filters = { ...state.filters, sortField, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.clearLogbooksStateAction, () => ({ ...initialLogbookState }))
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
    logbook.messages.forEach((message) => {
      if (message.content.msgtype === "m.image") {
        if (
          message.content.info &&
          message.content.info.hasOwnProperty("thumbnail_url")
        ) {
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
  }
  return logbook;
}
