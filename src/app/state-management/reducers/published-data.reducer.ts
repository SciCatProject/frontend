import { createReducer, Action, on } from "@ngrx/store";
import {
  initialPublishedDataState,
  PublishedDataState
} from "state-management/state/published-data.store";
import * as fromActions from "state-management/actions/published-data.actions";

const reducer = createReducer(
  initialPublishedDataState,

  on(
    fromActions.fetchAllPublishedDataCompleteAction,
    (state, { publishedData }) => ({
      ...state,
      publishedData
    })
  ),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count
  })),

  on(
    fromActions.fetchPublishedDataCompleteAction,
    (state, { publishedData }) => ({
      ...state,
      currentPublishedData: publishedData
    })
  ),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  })
);

export function publishedDataReducer(
  state: PublishedDataState | undefined,
  action: Action
) {
  if (action.type.indexOf("[PublishedData]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
