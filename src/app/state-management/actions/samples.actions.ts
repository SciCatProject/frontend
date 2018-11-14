import { Action } from "@ngrx/store";
import { Sample } from "shared/sdk/models";

export const SELECT_SAMPLE = "[Sample] Select Sample";

export const FETCH_SAMPLES = "[Sample] Fetch Samples";
export const FETCH_SAMPLES_COMPLETE = "[Sample] Fetch Samples Complete";
export const FETCH_SAMPLES_FAILED = "[Sample] Fetch Samples Failed";

export const FETCH_SAMPLE = "[Sample] Fetch Sample";
export const FETCH_SAMPLE_COMPLETE = "[Sample] Fetch Sample Complete";
export const FETCH_SAMPLE_FAILED = "[Sample] Fetch Sample Failed";

export class SelectSampleAction implements Action {
  type = SELECT_SAMPLE;

  constructor(readonly samplelId: string) {}
}

export class FetchSamplesAction implements Action {
  readonly type = FETCH_SAMPLES;
}

export class FetchSamplesCompleteAction implements Action {
  readonly type = FETCH_SAMPLES_COMPLETE;

  constructor(readonly samples: Sample[]) {}
}

export class FetchSamplesFailedAction implements Action {
  readonly type = FETCH_SAMPLES_FAILED;
}

export class FetchSampleAction implements Action {
  readonly type = FETCH_SAMPLE;

  constructor(readonly samplelId: string) {}
}

export class FetchSampleCompleteAction implements Action {
  readonly type = FETCH_SAMPLE_COMPLETE;

  constructor(readonly currentSample: Sample) {}
}

export class FetchSampleFailedAction implements Action {
  readonly type = FETCH_SAMPLE_FAILED;
}

export type SamplesActions =
  | SelectSampleAction
  | FetchSamplesAction
  | FetchSamplesCompleteAction
  | FetchSamplesFailedAction
  | FetchSampleAction
  | FetchSampleCompleteAction
  | FetchSampleFailedAction;
