import { createReducer, on, Action } from "@ngrx/store";
import {
  initialLogbookState,
  LogbookState,
} from "state-management/state/logbooks.store";
import * as fromActions from "state-management/actions/logbooks.actions";

const reducer = createReducer(
  initialLogbookState,
  on(
    fromActions.fetchLogbooksCompleteAction,
    (state, { logbooks }): LogbookState => {
      const formattedLogbooks = logbooks.map((logbook) => {
        const descendingMessages = logbook.messages.reverse();
        logbook.messages = descendingMessages;
        return logbook;
      });
      return { ...state, logbooks: formattedLogbooks };
    },
  ),

  on(
    fromActions.fetchLogbookCompleteAction,
    (state, { logbook }): LogbookState => {
      const currentLogbook = logbook;
      return { ...state, currentLogbook };
    },
  ),
  on(
    fromActions.fetchLogbookFailedAction,
    (state): LogbookState => ({
      ...state,
      currentLogbook: undefined,
    }),
  ),

  on(
    fromActions.clearLogbookAction,
    (state): LogbookState => ({
      ...state,
      currentLogbook: undefined,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): LogbookState => ({
      ...state,
      totalCount: count,
    }),
  ),

  on(fromActions.prefillFiltersAction, (state, { values }): LogbookState => {
    const filters = { ...state.filters, ...values };
    return { ...state, filters, hasPrefilledFilters: true };
  }),

  on(fromActions.setTextFilterAction, (state, { textSearch }): LogbookState => {
    const filters = { ...state.filters, textSearch, skip: 0 };
    return { ...state, filters };
  }),

  on(
    fromActions.setDisplayFiltersAction,
    (
      state,
      { showBotMessages, showImages, showUserMessages },
    ): LogbookState => {
      const filters = {
        ...state.filters,
        showBotMessages,
        showImages,
        showUserMessages,
        skip: 0,
      };
      return { ...state, filters };
    },
  ),

  on(fromActions.changePageAction, (state, { page, limit }): LogbookState => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  }),

  on(
    fromActions.sortByColumnAction,
    (state, { column, direction }): LogbookState => {
      const sortField = column + (direction ? ":" + direction : "");
      const filters = { ...state.filters, sortField, skip: 0 };
      return { ...state, filters };
    },
  ),

  on(
    fromActions.clearLogbooksStateAction,
    (): LogbookState => ({ ...initialLogbookState }),
  ),
);

export const logbooksReducer = (
  state: LogbookState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Logbook]") !== -1) {
    console.log("Logbook reducer Action came in! " + action.type);
  }
  return reducer(state, action);
};
