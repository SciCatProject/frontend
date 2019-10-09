import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "state-management/state/samples.store";

export const getSampleState = createFeatureSelector<SampleState>("samples");

export const getSamples = createSelector(
  getSampleState,
  state => state.samples
);

export const getCurrentSample = createSelector(
  getSampleState,
  state => state.currentSample
);

export const getCurrentAttachments = createSelector(
  getCurrentSample,
  sample => sample.attachments
);

export const getSampleDatasets = createSelector(
  getSampleState,
  state => state.datasets
);

export const getSamplesCount = createSelector(
  getSampleState,
  state => state.totalCount
);

export const getIsLoading = createSelector(
  getSampleState,
  state => state.isLoading
);

export const getFilters = createSelector(
  getSampleState,
  state => state.filters
);

export const getPage = createSelector(
  getFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getSamplesPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getFullqueryParams = createSelector(
  getFilters,
  filters => {
    const { text, sortField, skip, limit } = filters;
    const limits = { order: sortField, skip, limit };
    return { query: JSON.stringify({ text }), limits };
  }
);
