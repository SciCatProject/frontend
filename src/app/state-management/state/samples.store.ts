import { Sample, SampleFilters, Dataset, GenericFilters } from "state-management/models";

export interface SampleState {
  samples: Sample[];
  currentSample: Sample | undefined;
  datasets: Dataset[];
  metadataKeys: string[];

  samplesCount: number;
  datasetsCount: number;

  hasPrefilledFilters: boolean;
  sampleFilters: SampleFilters;

  datasetFilters: GenericFilters;
}

export const initialSampleState: SampleState = {
  samples: [],
  currentSample: undefined,
  datasets: [],
  metadataKeys: [],

  samplesCount: 0,
  datasetsCount: 0,

  hasPrefilledFilters: false,

  sampleFilters: {
    text: "",
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25,
    characteristics: []
  },

  datasetFilters: {
    sortField: "createdAt:desc",
    skip: 0,
    limit: 25
  }
};
