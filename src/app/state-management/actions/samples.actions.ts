import {Action} from "@ngrx/store";
import { Sample } from "shared/sdk/models";


export const SELECT_CURRENT = "[Sample] Current set selected";


export const FETCH_SAMPLES = "[Sample] Fetch Samples";
export const FETCH_SAMPLES_COMPLETE = "[Sample] Fetch Samples Complete";
export const FETCH_SAMPLES_FAILED = "[Sample] Fetch Samples Failed";



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


export type SamplesActions =
  | FetchSamplesAction
  | FetchSamplesCompleteAction
  | FetchSamplesFailedAction
