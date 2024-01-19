import { createReducer, Action, on } from "@ngrx/store";
import {
  initialPublishedDataState,
  PublishedDataState,
} from "state-management/state/published-data.store";
import * as fromActions from "state-management/actions/published-data.actions";

const reducer = createReducer(
  initialPublishedDataState,

  on(
    fromActions.fetchAllPublishedDataCompleteAction,
    (state, { publishedData }): PublishedDataState => ({
      ...state,
      publishedData,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): PublishedDataState => ({
      ...state,
      totalCount: count,
    }),
  ),

  on(
    fromActions.fetchPublishedDataCompleteAction,
    (state, { publishedData }): PublishedDataState => ({
      ...state,
      currentPublishedData: publishedData,
    }),
  ),

  on(
    fromActions.changePageAction,
    (state, { page, limit }): PublishedDataState => {
      const skip = page * limit;
      const filters = { ...state.filters, skip, limit };
      return { ...state, filters };
    },
  ),

  on(
    fromActions.sortByColumnAction,
    (state, { column, direction }): PublishedDataState => {
      const sortField = column + (direction ? ":" + direction : "");
      const filters = { ...state.filters, sortField, skip: 0 };
      return { ...state, filters };
    },
  ),

  on(
    fromActions.clearPublishedDataStateAction,
    (): PublishedDataState => ({
      ...initialPublishedDataState,
    }),
  ),
);

export const publishedDataReducer = (
  state: PublishedDataState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[PublishedData]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
