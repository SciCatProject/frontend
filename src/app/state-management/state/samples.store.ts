import { Sample } from "state-management/models";

export interface SampleState {
  samples: Sample[];
  selectedSamples: Sample[];
  currentSample: Sample;
  totalCount: number;
  submitComplete: boolean;

  samplesLoading: boolean;
  error: Error;

  skip: number;
  limit: number;
}

export const initialSampleState: SampleState = {
  samples: [],
  selectedSamples: [],
  currentSample: null,
  totalCount: 0,
  submitComplete: false,

  samplesLoading: true,
  error: undefined,
  skip: 0,
  limit: 0
};
