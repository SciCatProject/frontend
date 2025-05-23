import { OutputJobV3Dto } from "@scicatproject/scicat-sdk-ts-angular";
import { JobFilters } from "state-management/models";

export interface JobsState {
  jobs: OutputJobV3Dto[];
  currentJob: OutputJobV3Dto | undefined;

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
