import { createReducer, Action, on } from "@ngrx/store";
import { JobsState, initialJobsState } from "state-management/state/jobs.store";
import * as fromActions from "state-management/actions/jobs.actions";

const reducer = createReducer(
  initialJobsState,
  on(fromActions.fetchJobsCompleteAction, (state, { jobs }) => ({
    ...state,
    jobs
  })),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    totalCount: count
  })),

  on(fromActions.fetchJobCompleteAction, (state, { job }) => ({
    ...state,
    currentJob: job
  })),

  on(fromActions.submitJobCompleteAction, state => ({
    ...state,
    submitError: undefined
  })),
  on(fromActions.submitJobFailedAction, (state, { err }) => ({
    ...state,
    submitError: err
  })),

  on(fromActions.setJobViewModeAction, (state, { mode }) => ({
    ...state,
    filters: { ...state.filters, mode, skip: 0 }
  })),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? ":" + direction : "");
    const filters = { ...state.filters, sortField, skip: 0 };
    return { ...state, filters };
  })
);

export function jobsReducer(state: JobsState | undefined, action: Action) {
  if (action.type.indexOf("[Job]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
