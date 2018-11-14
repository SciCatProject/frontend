import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "../state/samples.store";

export const getSampleState = createFeatureSelector<SampleState>("samples");

export const getSelectedSampleId = createSelector(
  getSampleState,
  state => state.selectedId
);


const getSamples = createSelector(
  getSampleState,
  state => state.samples
);

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
