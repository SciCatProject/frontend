import { createReducer, Action, on } from "@ngrx/store";
import {
  initialPublishedDataState,
  PublishedDataState
} from "state-management/state/published-data.store";
import * as fromActions from "state-management/actions/published-data.actions";

const reducer = createReducer(
  initialPublishedDataState,
  on(fromActions.fetchAllPublishedDataAction, state => ({
    ...state,
    isLoading: true
  })),
  on(
    fromActions.fetchAllPublishedDataCompleteAction,
    (state, { publishedData }) => ({
      ...state,
      publishedData,
      isLoading: false
    })
  ),
  on(fromActions.fetchAllPublishedDataFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchCountAction, state => ({ ...state, isLoading: true })),
  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count,
    isLoading: false
  })),
  on(fromActions.fetchCountFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchPublishedDataAction, state => ({
    ...state,
    isLoading: true
  })),
  on(
    fromActions.fetchPublishedDataCompleteAction,
    (state, { publishedData }) => ({
      ...state,
      currentPublishedData: publishedData,
      isLoading: false
    })
  ),
  on(fromActions.fetchPublishedDataFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.publishDatasetAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.publishDatasetCompleteAction, state => ({
    ...state,
    isLoading: false
  })),
  on(fromActions.publishDatasetFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.registerPublishedDataAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.registerPublishedDataCompleteAction, state => ({
    ...state,
    isLoading: false
  })),
  on(fromActions.registerPublishedDataFailedAction, state => ({
    ...state,
    isLoading: false
  })),

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
