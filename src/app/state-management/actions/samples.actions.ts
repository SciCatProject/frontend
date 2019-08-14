import { Action } from "@ngrx/store";
import { Sample, Dataset, Attachment } from "shared/sdk/models";

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

export const FETCH_SAMPLE_COUNT = "[Sample] Fetch Sample Count";
export const FETCH_SAMPLE_COUNT_COMPLETE =
  "[Sample] Fetch Sample Count Complete";
export const FETCH_SAMPLE_COUNT_FAILED = "[Sample] Fetch Sample Count Failed";

export const SAMPLE_SORT_BY_COLUMN = "[Sample] Sort by Column";
export const CHANGE_PAGE = "[Sample] Change Page";

export const SEARCH_SAMPLES = "[Sample] Search Samples";
export const SET_CURRENT_SAMPLE = "[Sample] Set current Sample";

export const FETCH_DATASETS_FOR_SAMPLE = "[Sample] Fetch Datsets for Sample";
export const FETCH_DATASETS_FOR_SAMPLE_COMPLETE =
  "[Sample] Fetch Datasets for Sample Complete";
export const FETCH_DATASETS_FOR_SAMPLE_FAILED =
  "[Sample] Fetch Datasets for Sample Failed";
export const SET_CURRENT_DATASETS = "[Sample] Set current datasets";

export const ADD_ATTACHMENT = "[Sample] Add Attachment";
export const ADD_ATTACHMENT_COMPLETE = "[Sample] Add Attachment Complete";
export const ADD_ATTACHMENT_FAILED = "[Sample] Add Attachment Failed";

export const DELETE_ATTACHMENT = "[Sample] Delete Attachment";
export const DELETE_ATTACHMENT_COMPLETE = "[Sample] Delete Attachment Complete";
export const DELETE_ATTACHMENT_FAILED = "[Sample] Delete Attachment Failed";

export class FetchDatasetsForSample implements Action {
  readonly type = FETCH_DATASETS_FOR_SAMPLE;

  constructor(readonly sampleId: string) {}
}
export class FetchDatasetsForSampleComplete implements Action {
  readonly type = FETCH_DATASETS_FOR_SAMPLE_COMPLETE;

  constructor(readonly datasets: Dataset[]) {}
}

export class FetchDatasetsForSampleFailed implements Action {
  readonly type = FETCH_DATASETS_FOR_SAMPLE_FAILED;

  constructor() {}
}

export class SetCurrentDatasets implements Action {
  readonly type = SET_CURRENT_DATASETS;

  constructor(readonly datasets) {}
}

export class SetCurrentSample implements Action {
  readonly type = SET_CURRENT_SAMPLE;

  constructor(readonly sample) {}
}
export class SampleSortByColumnAction implements Action {
  readonly type = SAMPLE_SORT_BY_COLUMN;

  constructor(readonly column: string, readonly direction: string) {}
}

export class SearchSampleAction implements Action {
  type = SEARCH_SAMPLES;

  constructor(readonly query: string) {}
}
export class SelectSampleAction implements Action {
  type = SELECT_SAMPLE;

  constructor(readonly sampleId: string) {}
}

export class AddSampleAction implements Action {
  readonly type = ADD_SAMPLE;
  constructor(readonly sample: Sample) {}
}
export class AddSampleCompleteAction implements Action {
  readonly type = ADD_SAMPLE_COMPLETE;
  constructor(readonly sample: Sample) {}
}
export class AddSampleFailedAction implements Action {
  readonly type = ADD_SAMPLE_FAILED;
  constructor(readonly sample: Sample) {}
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
  constructor(readonly sampleId: string) {}
}

export class FetchSampleCompleteAction implements Action {
  readonly type = FETCH_SAMPLE_COMPLETE;

  constructor(readonly currentSample: Sample) {}
}

export class FetchSampleFailedAction implements Action {
  readonly type = FETCH_SAMPLE_FAILED;
}

export class FetchSampleCountAction implements Action {
  readonly type = FETCH_SAMPLE_COUNT;
  constructor(readonly sampleCount: number) {}
}

export class FetchSampleCountCompleteAction implements Action {
  readonly type = FETCH_SAMPLE_COUNT_COMPLETE;

  constructor(readonly sampleCount: number) {}
}

export class FetchSampleCountFailedAction implements Action {
  readonly type = FETCH_SAMPLE_COUNT_FAILED;
}

export class ChangePageAction implements Action {
  readonly type = CHANGE_PAGE;

  constructor(readonly page: number, readonly limit: number) {}
}

export class AddAttachmentAction implements Action {
  readonly type = ADD_ATTACHMENT;

  constructor(readonly attachment: Attachment) {}
}

export class AddAttachmentCompleteAction implements Action {
  readonly type = ADD_ATTACHMENT_COMPLETE;

  constructor(readonly attachment: Attachment) {}
}

export class AddAttachmentFailedAction implements Action {
  readonly type = ADD_ATTACHMENT_FAILED;

  constructor(readonly error: Error) {}
}

export class DeleteAttachmentAction implements Action {
  readonly type = DELETE_ATTACHMENT;

  constructor(readonly sampleId: string, readonly attachmentId: string) {}
}

export class DeleteAttachmentCompleteAction implements Action {
  readonly type = DELETE_ATTACHMENT_COMPLETE;

  constructor(readonly attachmentId: string) {}
}

export class DeleteAttachmentFailedAction implements Action {
  readonly type = DELETE_ATTACHMENT_FAILED;

  constructor(readonly error: Error) {}
}

export type SamplesActions =
  | SelectSampleAction
  | AddSampleAction
  | AddSampleCompleteAction
  | AddSampleFailedAction
  | SampleSortByColumnAction
  | ChangePageAction
  | FetchSamplesAction
  | FetchSamplesCompleteAction
  | FetchSamplesFailedAction
  | FetchSampleAction
  | FetchSampleCompleteAction
  | FetchSampleFailedAction
  | FetchSampleCountAction
  | FetchSampleCountCompleteAction
  | FetchSampleCountFailedAction
  | AddAttachmentAction
  | AddAttachmentCompleteAction
  | AddAttachmentFailedAction
  | DeleteAttachmentAction
  | DeleteAttachmentCompleteAction
  | DeleteAttachmentFailedAction;

export type FetchDatasetsForSampleOutcomeAction =
  | FetchDatasetsForSampleComplete
  | FetchDatasetsForSampleFailed;
