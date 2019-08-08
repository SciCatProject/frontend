import { Sample, SampleFilters } from "state-management/models";

export interface SampleState {
  samples: { [sampleId: string]: Sample };
  selectedSamples: Sample[];
  datasets: { [datasetId: string]: any };
  hasFetched: boolean;
  currentSample: Sample;
  totalCount: number;
  submitComplete: boolean;

  samplesLoading: boolean;
  datasetsLoading: boolean;
  error: Error;

  searchTerms: string;

  selectedId: string;
  filters: SampleFilters;
}

export const initialSampleState: SampleState = {
  samples: {},
  selectedSamples: [],
  datasets: {},
  hasFetched: false,
  currentSample: null,
  totalCount: 0,
  submitComplete: false,

  samplesLoading: true,
  datasetsLoading: true,
  error: undefined,

  searchTerms: "",

  filters: {
    text: "",
    sortField: "creationTime:desc",
    skip: 0,
    limit: 30
  },
  selectedId: null
};
