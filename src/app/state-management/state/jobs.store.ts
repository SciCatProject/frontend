import * as lb from 'shared/sdk/models';

export interface JobsState {
  currentJobs: lb.Job[];
  jobSubmission: lb.Job[];
  skip: any;
  ui: any;
  }

export const initialJobsState: JobsState = {
  currentJobs : [],
  jobSubmission : undefined,
  skip: 0,
  ui: []
};
