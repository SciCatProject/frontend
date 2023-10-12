import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobsState } from "state-management/state/jobs.store";

const selectJobState = createFeatureSelector<JobsState>("jobs");

export const selectJobs = createSelector(selectJobState, (state) => state.jobs);

export const selectCurrentJob = createSelector(
  selectJobState,
  (state) => state.currentJob,
);

export const selectJobsCount = createSelector(
  selectJobState,
  (state) => state.totalCount,
);

export const selectSubmitError = createSelector(
  selectJobState,
  (state) => state.submitError,
);

export const selectFilters = createSelector(
  selectJobState,
  (state) => state.filters,
);

export const selectJobViewMode = createSelector(
  selectFilters,
  (filters) => filters.mode,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectJobsPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectQueryParams = createSelector(selectFilters, (filters) => {
  const { mode, sortField, skip, limit } = filters;
  if (mode) {
    return { where: mode, order: sortField, skip, limit };
  } else {
    return { order: sortField, skip, limit };
  }
});
