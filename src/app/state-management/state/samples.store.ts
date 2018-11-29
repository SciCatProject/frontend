import { Sample, SampleFilters } from "state-management/models";

export interface SampleState {
  samples: { [samplelId: string]: Sample };
  selectedSamples: Sample[];
  currentSample: Sample;
  totalCount: number;
  submitComplete: boolean;

  samplesLoading: boolean;
  error: Error;

  skip: number;
  limit: number;
  selectedId: string;
  filters: SampleFilters;
}

export const initialSampleState: SampleState = {
  samples: {},
  selectedSamples: [],
  currentSample: null,
  totalCount: 0,
  submitComplete: false,

  samplesLoading: true,
  error: undefined,
  skip: 0,
  limit: 0,
  filters: {
    sortField: "creationTime:desc"
  },
  selectedId: null
};
