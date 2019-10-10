import { Sample, SampleFilters, Dataset } from "state-management/models";

export interface SampleState {
  samples: Sample[];
  currentSample: Sample;
  datasets: Dataset[];

  totalCount: number;

  isLoading: boolean;

  filters: SampleFilters;
}

export const initialSampleState: SampleState = {
  samples: [],
  datasets: [],
  currentSample: null,

  totalCount: 0,

  isLoading: true,

  filters: {
    text: "",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  }
};
