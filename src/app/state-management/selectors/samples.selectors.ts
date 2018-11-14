import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "../state/samples.store";

export const getSampleState = createFeatureSelector<SampleState>("samples");

export const getSelectedSampleId = createSelector(
  getSampleState,
  state => state.selectedId
);

export const getSamples = (state: any) => state.root.samples.samples;

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
