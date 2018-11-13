import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SampleState } from "../state/samples.store";

export const getSampleState = createFeatureSelector<SampleState>("samples");


export const getSamples = (state: any) => state.root.samples.samples;
