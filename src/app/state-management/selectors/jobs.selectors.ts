import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobsState } from "state-management/state/jobs.store";
import {
  selectHasFetchedSettings,
  selectIsLoading,
  selectSettings,
} from "./user.selectors";

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
  const { mode, text, sortField, skip, limit } = filters;
  const fields: { mode?: Record<string, string>; text?: string } = {};
  if (mode) {
    fields.mode = mode;
  }
  if (text) {
    fields.text = text;
  }
  return { fields, limits: { order: sortField, skip, limit } };
});

export const selectJobsDashboardPageViewModel = createSelector(
  selectJobs,
  selectJobsCount,
  selectPage,
  selectJobsPerPage,
  selectFilters,
  selectSettings,
  selectHasFetchedSettings,
  selectIsLoading,
  (
    jobs,
    count,
    currentPage,
    jobsPerPage,
    filters,
    settings,
    hasFetchedSettings,
    isLoading,
  ) => ({
    jobs,
    count,
    currentPage,
    jobsPerPage,
    filters,
    hasFetchedSettings,
    isLoading,
    tableSettings: {
      columns: settings.fe_job_table_columns,
    },
  }),
);
