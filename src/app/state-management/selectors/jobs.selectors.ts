import {createSelector, Store} from '@ngrx/store';

export const submitJob = (state: any) => state.root.jobs.jobSubmission;
export const getError = (state: any) => state.root.jobs.error;
