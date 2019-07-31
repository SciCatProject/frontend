import { SampleState } from "../state/samples.store";
import { createFeatureSelector, createSelector } from "@ngrx/store";

export const getSampleState = createFeatureSelector<SampleState>("samples");

export const getSelectedSampleId = createSelector(
  getSampleState,
  state => state.selectedId
);

const getSamples = createSelector(
  getSampleState,
  state => state.samples
);

export const getSampleFilters = createSelector(
  getSampleState,
  state => {
    return state.filters.sortField;
  }
);

export const getSampleCount = createSelector(
  getSampleState,
  state => {
    return state.totalCount;
  }
);

export const getQuery = createSelector(
  getSampleState,
  state => {
    const query = {
      text: state.filters.text,
      order: state.filters.sortField,
      skip: state.filters.skip,
      limit: state.filters.limit
    };
    return query;
  }
);

export const getFullqueryParams = createSelector(
  getSampleState,
  state => {
    const query = {
      text: state.filters.text
    };
    const limits = {
      order: state.filters.sortField,
      skip: state.filters.skip,
      limit: state.filters.limit
    };
    return {
      query: JSON.stringify(query),
      limits
    };
  }
);

export const getSamplesList = createSelector(
  getSamples,
  samples => Object.keys(samples).map(sampleId => samples[sampleId])
);

const getSamples2 = createSelector(
  getSampleState,
  state => state.samples
);

export const getSelectedSample = createSelector(
  getSamples2,
  getSelectedSampleId,
  (samples, selectedId) => samples[selectedId] || null
);

export const getPage = createSelector(
  getSampleState,
  state => {
    const { skip, limit } = state.filters;
    return skip / limit;
  }
);

export const getSamplesPerPage = createSelector(
  getSampleState,
  state => state.filters.limit
);

export const getCurrentSample = (state: any) =>
  state.root.samples.currentSample;
