import { Action } from "@ngrx/store";
import { Sample } from "shared/sdk/models";

export const SELECT_SAMPLE = "[Sample] Select Sample";

export const ADD_SAMPLE = "[Sample] Add Samples";
export const ADD_SAMPLE_COMPLETE = "[Sample] Add Samples Complete";
export const ADD_SAMPLE_FAILED = "[Sample] Add Samples Failed";

export const FETCH_SAMPLES = "[Sample] Fetch Samples";
export const FETCH_SAMPLES_COMPLETE = "[Sample] Fetch Samples Complete";
export const FETCH_SAMPLES_FAILED = "[Sample] Fetch Samples Failed";

export const FETCH_SAMPLE = "[Sample] Fetch Sample";
export const FETCH_SAMPLE_COMPLETE = "[Sample] Fetch Sample Complete";
export const FETCH_SAMPLE_FAILED = "[Sample] Fetch Sample Failed";

export class SelectSampleAction implements Action {
  type = SELECT_SAMPLE;

  constructor(readonly samplelId: string) { }
}

export class AddSampleAction implements Action {
  readonly type = ADD_SAMPLE;
  constructor(readonly sample: Sample) { }
}
export class AddSampleCompleteAction implements Action {
  readonly type = ADD_SAMPLE_COMPLETE;
  constructor(readonly sample: Sample) { }
}
export class AddSampleFailedAction implements Action {
  readonly type = ADD_SAMPLE_FAILED;
  constructor(readonly sample: Sample) { }
}
export class FetchSamplesAction implements Action {
  readonly type = FETCH_SAMPLES;
}

export class FetchSamplesCompleteAction implements Action {
  readonly type = FETCH_SAMPLES_COMPLETE;

  constructor(readonly samples: Sample[]) { }
}

export class FetchSamplesFailedAction implements Action {
  readonly type = FETCH_SAMPLES_FAILED;
}

export class FetchSampleAction implements Action {
  readonly type = FETCH_SAMPLE;

  constructor(readonly samplelId: string) { }
}

export class FetchSampleCompleteAction implements Action {
  readonly type = FETCH_SAMPLE_COMPLETE;

  constructor(readonly currentSample: Sample) { }
}

export class FetchSampleFailedAction implements Action {
  readonly type = FETCH_SAMPLE_FAILED;
}

export type SamplesActions =
  | SelectSampleAction
  | AddSampleAction
  | AddSampleCompleteAction
  | AddSampleFailedAction
  | FetchSamplesAction
  | FetchSamplesCompleteAction
  | FetchSamplesFailedAction
  | FetchSampleAction
  | FetchSampleCompleteAction
  | FetchSampleFailedAction;
