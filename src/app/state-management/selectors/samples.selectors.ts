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


export const getQuery = createSelector (getSampleState, state => {
    console.log(state.filters);
    const query = {order: state.filters.sortField};
    return query;
});



export const getSamplesList = createSelector(getSamples, samples =>
  Object.keys(samples).map(samplelId => samples[samplelId])
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


export const getCurrentSample = (state: any) => state.root.samples.currentSample;
