import { Sample, SampleFilters, Dataset } from "state-management/models";

export interface SampleState {
  samples: Sample[];
  currentSample: Sample;
  datasets: Dataset[];

  samplesCount: number;
  datasetsCount: number;

  samplefilters: SampleFilters;

  datasetFilters: SampleFilters;
}

export const initialSampleState: SampleState = {
  samples: [],
  currentSample: null,
  datasets: [],

  samplesCount: 0,
  datasetsCount: 0,

  samplefilters: {
    text: "",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 25
  },

  datasetFilters: {
    text: "",
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25
  }
};
