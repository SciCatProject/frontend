import {Job} from "shared/sdk/models";

export interface JobsState {
    currentJobs: Job[];
    jobSubmission: Job[];
    filters: object;
    totalJobNumber: number;
    ui: any;
    loading: boolean;
    error: Error;
}

export const initialJobsState: JobsState = {
    currentJobs: [],
    jobSubmission: undefined,
    filters: {"skip": 0, "limit": 50, "mode": ""},
    totalJobNumber: 1000,
    ui: [],
    loading: false,
    error: undefined
};
