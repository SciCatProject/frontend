import { createReducer, Action, on } from "@ngrx/store";
import { JobsState, initialJobsState } from "state-management/state/jobs.store";
import * as fromActions from "state-management/actions/jobs.actions";

const reducer = createReducer(
  initialJobsState,
  on(
    fromActions.fetchJobsCompleteAction,
    (state, { jobs }): JobsState => ({
      ...state,
      jobs,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): JobsState => ({
      ...state,
      totalCount: count,
    }),
  ),

  on(
    fromActions.fetchJobCompleteAction,
    (state, { job }): JobsState => ({
      ...state,
      currentJob: job,
    }),
  ),

  on(
    fromActions.submitJobCompleteAction,
    (state): JobsState => ({
      ...state,
      submitError: undefined,
    }),
  ),
  on(
    fromActions.submitJobFailedAction,
    (state, { err }): JobsState => ({
      ...state,
      submitError: err,
    }),
  ),

  on(
    fromActions.setJobViewModeAction,
    (state, { mode }): JobsState => ({
      ...state,
      filters: { ...state.filters, mode, skip: 0 },
    }),
  ),

  on(fromActions.setJobsLimitFilterAction, (state, { limit }): JobsState => {
    const filters = { ...state.filters, limit, skip: 0 };
    return { ...state, filters };
  }),

  on(fromActions.changePageAction, (state, { page, limit }): JobsState => {
    const skip = page * limit;
    const filters = { ...state.filters, skip, limit };
    return { ...state, filters };
  }),

  on(
    fromActions.sortByColumnAction,
    (state, { column, direction }): JobsState => {
      const sortField = column + (direction ? " " + direction : "");
      const filters = { ...state.filters, sortField, skip: 0 };
      return { ...state, filters };
    },
  ),

  on(
    fromActions.clearJobsStateAction,
    (): JobsState => ({ ...initialJobsState }),
  ),
);

export const jobsReducer = (state: JobsState | undefined, action: Action) => {
  if (action.type.indexOf("[Job]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
