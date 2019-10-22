import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobsState } from "state-management/state/jobs.store";

const getJobState = createFeatureSelector<JobsState>("jobs");

export const getJobs = createSelector(
  getJobState,
  state => state.jobs
);

export const getCurrentJob = createSelector(
  getJobState,
  state => state.currentJob
);

export const getJobsCount = createSelector(
  getJobState,
  state => state.totalCount
);

export const getSubmitError = createSelector(
  getJobState,
  state => state.submitError
);

export const getFilters = createSelector(
  getJobState,
  state => state.filters
);

export const getJobViewMode = createSelector(
  getFilters,
  filters => filters.mode
);

export const getPage = createSelector(
  getFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getJobsPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getQueryParams = createSelector(
  getFilters,
  filters => {
    const { mode, sortField, skip, limit } = filters;
    if (mode) {
      return { where: mode, order: sortField, skip, limit };
    } else {
      return { order: sortField, skip, limit };
    }
  }
);
