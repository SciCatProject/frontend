import {
  FETCH_SAMPLE,
  FETCH_SAMPLE_COMPLETE,
  FETCH_SAMPLE_FAILED,
  FETCH_SAMPLES,
  FETCH_SAMPLES_COMPLETE,
  FETCH_SAMPLES_FAILED,
  FetchSampleCompleteAction,
  FetchSamplesCompleteAction,
  SamplesActions,
  SELECT_SAMPLE,
  SelectSampleAction
} from "state-management/actions/samples.actions";
import { initialSampleState, SampleState } from "../state/samples.store";

export function samplesReducer(
  state: SampleState = initialSampleState,
  action: SamplesActions
): SampleState {
  if (action.type.indexOf("[Sample]") !== -1) {
    console.log("Action came in! " + action.type);
  }

  switch (action.type) {
    case SELECT_SAMPLE: {
      const selectedId = (action as SelectSampleAction).samplelId;
      return { ...state, selectedId };
    }

    case FETCH_SAMPLES: {
      return { ...state, samplesLoading: true };
    }

    case FETCH_SAMPLES_COMPLETE: {
      const list = (action as FetchSamplesCompleteAction).samples;
      const samples = list.reduce(
        (samples, sample) => ({
          ...samples,
          [sample.samplelId]: sample
        }),
        {}
      );
      return { ...state, samples, samplesLoading: false };
    }

    case FETCH_SAMPLES_FAILED: {
      return { ...state, samplesLoading: false };
    }

    case FETCH_SAMPLE: {
      return { ...state, samplesLoading: true };
    }

    case FETCH_SAMPLE_COMPLETE: {
      const currentSample = (action as FetchSampleCompleteAction).currentSample;
      return { ...state, currentSample, samplesLoading: false };
    }

    case FETCH_SAMPLE_FAILED: {
      return { ...state, samplesLoading: false };
    }

    default: {
      return state;
    }
  }
}
