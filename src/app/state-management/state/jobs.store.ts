import * as lb from 'shared/sdk/models';

export interface JobsState {
  currentJobs: lb.Job[];
  jobSubmission: lb.Job[];
  skip: any;
  totalJobNumber: number;
  ui: any;
  error: string;
  }

export const initialJobsState: JobsState = {
  currentJobs : [],
  jobSubmission : undefined,
  skip: 0,
  totalJobNumber: 1000,
  ui: [],
  error: undefined
};
