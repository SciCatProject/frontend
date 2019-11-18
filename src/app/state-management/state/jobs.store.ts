import { Job } from "shared/sdk/models";
import { JobFilters } from "state-management/models";

export interface JobsState {
  jobs: Job[];
  currentJob: Job;

  totalCount: number;

  submitError: Error;

  filters: JobFilters;
}

export const initialJobsState: JobsState = {
  jobs: [],
  currentJob: null,

  totalCount: 0,

  submitError: undefined,

  filters: {
    mode: null,
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  }
};
