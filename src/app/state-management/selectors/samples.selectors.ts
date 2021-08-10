import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "state-management/state/samples.store";

const getSampleState = createFeatureSelector<SampleState>("samples");

export const getSamples = createSelector(
  getSampleState,
  (state) => state.samples
);

export const getMetadataKeys = createSelector(
  getSampleState,
  (state) => state.metadataKeys
);

export const getCurrentSample = createSelector(
  getSampleState,
  (state) => state.currentSample
);

export const getCurrentAttachments = createSelector(
  getCurrentSample,
  (sample) => (sample ? sample.attachments : [])
);

export const getDatasets = createSelector(
  getSampleState,
  (state) => state.datasets
);

export const getSamplesCount = createSelector(
  getSampleState,
  (state) => state.samplesCount
);

export const getDatasetsCount = createSelector(
  getSampleState,
  (state) => state.datasetsCount
);

export const getHasPrefilledFilters = createSelector(
  getSampleState,
  (state) => state.hasPrefilledFilters
);

export const getFilters = createSelector(
  getSampleState,
  (state) => state.sampleFilters
);

export const getTextFilter = createSelector(
  getFilters,
  (filters) => filters.text
);

export const getDatasetFilters = createSelector(
  getSampleState,
  (state) => state.datasetFilters
);

export const getPage = createSelector(getFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const getDatasetsPage = createSelector(getDatasetFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const getSamplesPerPage = createSelector(
  getFilters,
  (filters) => filters.limit
);

export const getCharacteristicsFilter = createSelector(
  getFilters,
  (filters) => filters.characteristics
);

export const getDatasetsPerPage = createSelector(
  getDatasetFilters,
  (filters) => filters.limit
);

export const getFullqueryParams = createSelector(getFilters, (filters) => {
  const { sortField, skip, limit, ...theRest } = filters;
  const limits = { order: sortField, skip, limit };
  const query = restrictFilter(theRest);
  return { query: JSON.stringify(query), limits };
});

export const getDatasetsQueryParams = createSelector(
  getDatasetFilters,
  (filters) => {
    const { sortField, skip, limit } = filters;
    return { order: sortField, skip, limit };
  }
);

// Returns copy with null/undefined values and empty arrays removed
const restrictFilter = (filter: any, allowedKeys?: string[]) => {
  const isNully = (value: any) => {
    const hasLength = typeof value === "string" || Array.isArray(value);
    return value == null || (hasLength && value.length === 0);
  };

  const keys = allowedKeys || Object.keys(filter);
  return keys.reduce((obj, key) => {
    const val = filter[key];
    return isNully(val) ? obj : { ...obj, [key]: val };
  }, {});
};
