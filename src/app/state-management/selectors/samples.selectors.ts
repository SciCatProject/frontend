import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "state-management/state/samples.store";
import { selectCurrentUser, selectTablesSettings } from "./user.selectors";

const selectSampleState = createFeatureSelector<SampleState>("samples");

export const selectSamples = createSelector(
  selectSampleState,
  (state) => state.samples,
);

export const selectMetadataKeys = createSelector(
  selectSampleState,
  (state) => state.metadataKeys,
);

export const selectCurrentSample = createSelector(
  selectSampleState,
  (state) => state.currentSample,
);

export const selectCurrentAttachments = createSelector(
  selectSampleState,
  (state) => state.attachments,
);

export const selectDatasets = createSelector(
  selectSampleState,
  (state) => state.datasets,
);

export const selectSamplesCount = createSelector(
  selectSampleState,
  (state) => state.samplesCount,
);

export const selectDatasetsCount = createSelector(
  selectSampleState,
  (state) => state.datasetsCount,
);

export const selectHasPrefilledFilters = createSelector(
  selectSampleState,
  (state) => state.hasPrefilledFilters,
);

export const selectFilters = createSelector(
  selectSampleState,
  (state) => state.sampleFilters,
);

export const selectTextFilter = createSelector(
  selectFilters,
  (filters) => filters.text,
);

export const selectDatasetFilters = createSelector(
  selectSampleState,
  (state) => state.datasetFilters,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectDatasetsPage = createSelector(
  selectDatasetFilters,
  (filters) => {
    const { skip, limit } = filters;
    return skip / limit;
  },
);

export const selectSamplesPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectCharacteristicsFilter = createSelector(
  selectFilters,
  (filters) => filters.characteristics,
);

export const selectDatasetsPerPage = createSelector(
  selectDatasetFilters,
  (filters) => filters.limit,
);

export const selectSamplesPagination = createSelector(
  selectSamplesCount,
  selectSamplesPerPage,
  selectPage,
  (samplesCount, samplesPerPage, currentPage) => ({
    samplesCount,
    samplesPerPage,
    currentPage,
  }),
);

export const selectSampleDashboardPageViewModel = createSelector(
  selectSamples,
  selectSamplesPagination,
  selectFilters,
  selectHasPrefilledFilters,
  selectTextFilter,
  selectMetadataKeys,
  selectCharacteristicsFilter,
  selectTablesSettings,
  selectSamplesCount,
  (
    samples,
    samplesPagination,
    filters,
    hasPrefilledFilters,
    textFilter,
    metadataKeys,
    characteristicsFilter,
    tableSettings,
    count,
  ) => ({
    samples,
    samplesPagination,
    filters,
    hasPrefilledFilters,
    textFilter,
    metadataKeys,
    characteristicsFilter,
    tableSettings,
    count,
  }),
);

export const selectSampleDetailPageViewModel = createSelector(
  selectCurrentSample,
  selectDatasets,
  selectDatasetsPerPage,
  selectDatasetsPage,
  selectDatasetsCount,
  selectCurrentAttachments,
  selectCurrentUser,
  (
    sample,
    datasets,
    datasetsPerPage,
    datasetsPage,
    datasetsCount,
    attachments,
    user,
  ) => ({
    sample,
    datasets,
    datasetsPerPage,
    datasetsPage,
    datasetsCount,
    attachments,
    user,
  }),
);

export const selectFullqueryParams = createSelector(
  selectFilters,
  (filters) => {
    const { sortField, skip, limit, ...theRest } = filters;
    const limits = { order: sortField, skip, limit };
    const query = restrictFilter(theRest);
    return { query, limits };
  },
);

export const selectDatasetsQueryParams = createSelector(
  selectDatasetFilters,
  (filters) => {
    const { sortField, skip, limit } = filters;
    return { order: sortField, skip, limit };
  },
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
