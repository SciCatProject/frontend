import { JobClass } from "@scicatproject/scicat-sdk-ts-angular";
import { JobFilters } from "state-management/models";

export interface JobsState {
  jobs: JobClass[];
  currentJob: JobClass | undefined;

  totalCount: number;

  submitError: Error | undefined;

  filters: JobFilters;
}

export const initialJobsState: JobsState = {
  jobs: [],
  currentJob: undefined,

  totalCount: 0,

  submitError: undefined,

  filters: {
    mode: undefined,
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25,
  },
};
