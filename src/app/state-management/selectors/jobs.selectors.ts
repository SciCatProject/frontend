import { createFeatureSelector, createSelector } from "@ngrx/store";
import { JobsState } from "../state/jobs.store";

export const getJobState = createFeatureSelector<JobsState>("jobs");

export const getError = createSelector(getJobState, state => state.error);

export const getLoading = createSelector(getJobState, state => state.loading);

export const getJobs = createSelector(getJobState, state => state.currentJobs);

export const getFilters = createSelector(getJobState, state => state.filters);

export const submitJob = createSelector(getJobState, state => state.jobSubmission);

export const getCurrentJob = (state: any) => state.root.jobs.currentSet;

export const getUI = (state: any) => state.root.jobs.ui;
