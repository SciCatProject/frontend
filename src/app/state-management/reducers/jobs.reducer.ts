import { createReducer, Action, on } from "@ngrx/store";
import { JobsState, initialJobsState } from "state-management/state/jobs.store";
import * as fromActions from "state-management/actions/jobs.actions";

const reducer = createReducer(
  initialJobsState,
  on(fromActions.fetchJobsAction, state => ({ ...state, isLoading: true })),
  on(fromActions.fetchJobsCompleteAction, (state, { jobs }) => ({
    ...state,
    jobs,
    isLoading: false
  })),
  on(fromActions.fetchJobsFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count
  })),

  on(fromActions.fetchJobAction, state => ({ ...state, isLoading: true })),
  on(fromActions.fetchJobCompleteAction, (state, { job }) => ({
    ...state,
    currentJob: job,
    isLoading: false
  })),
  on(fromActions.fetchJobFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.submitJobAction, state => ({ ...state, isLoading: true })),
  on(fromActions.submitJobCompleteAction, state => ({
    ...state,
    isLoading: false
  })),
  on(fromActions.submitJobFailedAction, (state, { err }) => ({
    ...state,
    submitError: err,
    isLoading: false
  })),

  on(fromActions.setJobViewModeAction, (state, { mode }) => ({
    ...state,
    filters: { ...state.filters, mode, skip: 0 }
  })),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    return { ...state, filters: { ...state.filters, skip, limit } };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? " " + direction : "");
    return { ...state, filters: { ...state.filters, sortField, skip: 0 } };
  })
);

export function jobsReducer(state: JobsState | undefined, action: Action) {
  if (action.type.indexOf("[Job]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
