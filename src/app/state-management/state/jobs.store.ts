import * as lb from 'shared/sdk/models';

export interface JobsState {
  currentJobs: lb.Job[];
  jobSubmission: lb.Job[];
  ui: any;
  }

export const initialJobsState: JobsState = {
  currentJobs : [],
  jobSubmission : undefined,
  ui: []
};
