import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "state-management/state/samples.store";

const getSampleState = createFeatureSelector<SampleState>("samples");

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

export const getDatasets = createSelector(
  getSampleState,
  state => state.datasets
);

export const getSamplesCount = createSelector(
  getSampleState,
  state => state.samplesCount
);

export const getDatasetsCount = createSelector(
  getSampleState,
  state => state.datasetsCount
);

export const getFilters = createSelector(
  getSampleState,
  state => state.samplefilters
);

export const getDatasetFilters = createSelector(
  getSampleState,
  state => state.datasetFilters
);

export const getPage = createSelector(
  getFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getDatasetsPage = createSelector(
  getDatasetFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getSamplesPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getDatasetsPerPage = createSelector(
  getDatasetFilters,
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

export const getDatasetsQueryParams = createSelector(
  getDatasetFilters,
  filters => {
    const { sortField, skip, limit } = filters;
    return { order: sortField, skip, limit };
  }
);
