import * as lb from 'shared/sdk/models';

export interface JobsState {
  currentJobs: lb.Job[];
  jobSubmission: lb.Job[];
  filters: object;
  totalJobNumber: number;
  ui: any;
  loading: boolean;
  error: string;
  }

export const initialJobsState: JobsState = {
  currentJobs : [],
  jobSubmission : undefined,
  filters: {'skip': 0, 'limit': 50},
  totalJobNumber: 1000,
  ui: [],
  loading: false,
  error: undefined
};
