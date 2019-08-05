import { Sample, SampleFilters } from "state-management/models";

export interface SampleState {
  samples: { [sampleId: string]: Sample };
  selectedSamples: Sample[];
  datasets: { [datasetId: string]: any };
  currentSample: Sample;
  totalCount: number;
  submitComplete: boolean;

  samplesLoading: boolean;
  error: Error;

  searchTerms: string;

  selectedId: string;
  filters: SampleFilters;
}

export const initialSampleState: SampleState = {
  samples: {},
  selectedSamples: [],
  datasets: {},
  currentSample: null,
  totalCount: 0,
  submitComplete: false,

  samplesLoading: true,
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
