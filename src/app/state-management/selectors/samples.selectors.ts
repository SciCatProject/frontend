import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "../state/samples.store";

export const getSampleState = createFeatureSelector<SampleState>("samples");

// const getSampleState = createFeatureSelector<PolicyState>('policies');

export const getCurrentSample = createSelector(
  getSampleState,
  state => state.currentSample
);

export const getSamples = createSelector(
  getSampleState,
  state => state.samples
);

export const getSelectedSamples = createSelector(
  getSampleState,
  state => state.selectedSamples
);

export const isEmptySelection = createSelector(
  getSelectedSamples,
  sets => sets.length === 0
);

export const getSamplesPerPage = createSelector(
  getSampleState,
  state => state
);

export const getPage = createSelector(getSampleState, state => {
  const { skip, limit } = state;
  return skip / limit;
});
