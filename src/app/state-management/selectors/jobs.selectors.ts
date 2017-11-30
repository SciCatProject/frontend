import {createSelector, Store} from '@ngrx/store';

export const submitJob = (state: any) => state.root.jobs.jobSubmission;
export const getError = (state: any) => state.root.jobs.error;
export const getLoading = (state: any) => state.root.jobs.loading;

export const getCurrentJob = (state: any) => state.root.jobs.currentSet;
export const getJobs = (state: any) => state.root.jobs.currentJobs;
export const getFilters = (state: any) => state.root.jobs.filters;

export const getUI = (state: any) => state.root.jobs.ui;
