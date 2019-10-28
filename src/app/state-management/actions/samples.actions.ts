import { createAction, props } from "@ngrx/store";
import { Sample, Dataset, Attachment } from "shared/sdk";

export const fetchSamplesAction = createAction("[Sample] Fetch Samples");
export const fetchSamplesCompleteAction = createAction(
  "[Sample] Fetch Samples Complete",
  props<{ samples: Sample[] }>()
);
export const fetchSamplesFailedAction = createAction(
  "[Sample] Fetch Samples Failed"
);

export const fetchSamplesCountAction = createAction(
  "[Sample] Fetch Samples Count"
);
export const fetchSamplesCountCompleteAction = createAction(
  "[Sample] Fetch Samples Count Complete",
  props<{ count: number }>()
);
export const fetchSamplesCountFailedAction = createAction(
  "[Sample] Fetch Samples Count Failed"
);

export const fetchSampleAction = createAction(
  "[Sample] Fetch Sample",
  props<{ sampleId: string }>()
);
export const fetchSampleCompleteAction = createAction(
  "[Sample] Fetch Sample Complete",
  props<{ sample: Sample }>()
);
export const fetchSampleFailedAction = createAction(
  "[Sample] Fetch Sample Failed"
);

export const fetchSampleDatasetsAction = createAction(
  "[Sample] Fetch Datasets",
  props<{ sampleId: string }>()
);
export const fetchSampleDatasetsCompleteAction = createAction(
  "[Sample] Fetch Datasets Complete",
  props<{ datasets: Dataset[] }>()
);
export const fetchSampleDatasetsFailedAction = createAction(
  "[Sample] Fetch Datasets Failed"
);

export const fetchSampleDatasetsCountAction = createAction(
  "[Sample] Fetch Datasets Count",
  props<{ sampleId: string }>()
);
export const fetchSampleDatasetsCountCompleteAction = createAction(
  "[Sample] Fetch Datasets Count Complete",
  props<{ count: number }>()
);
export const fetchSampleDatasetsCountFailedAction = createAction(
  "[Sample] Fetch Datasets Count Failed"
);

export const addSampleAction = createAction(
  "[Sample] Add Sample",
  props<{ sample: Sample }>()
);
export const addSampleCompleteAction = createAction(
  "[Sample] Add Sample Complete",
  props<{ sample: Sample }>()
);
export const addSampleFailedAction = createAction("[Sample] Add Sample Failed");

export const saveCharacteristicsAction = createAction(
  "[Sample] Save Characteristics",
  props<{ sampleId: string; characteristics: object }>()
);
export const saveCharacteristicsCompleteAction = createAction(
  "[Sample] Save Characteristics Complete",
  props<{ sample: Sample }>()
);
export const saveCharacteristicsFailedAction = createAction(
  "[Sample] Save Characteristics Failed"
);

export const addAttachmentAction = createAction(
  "[Sample] Add Attachment",
  props<{ attachment: Attachment }>()
);
export const addAttachmentCompleteAction = createAction(
  "[Sample] Add Attachment Complete",
  props<{ attachment: Attachment }>()
);
export const addAttachmentFailedAction = createAction(
  "[Sample] Add Attachment Failed"
);

export const updateAttachmentCaptionAction = createAction(
  "[Sample] Update Attachment Caption",
  props<{ sampleId: string; attachmentId: string; caption: string }>()
);
export const updateAttachmentCaptionCompleteAction = createAction(
  "[Sample] Update Attachment Caption Complete",
  props<{ attachment: Attachment }>()
);
export const updateAttachmentCaptionFailedAction = createAction(
  "[Sample] Update Attachment Caption Failed"
);

export const removeAttachmentAction = createAction(
  "[Sample] Remove Attachment",
  props<{ sampleId: string; attachmentId: string }>()
);
export const removeAttachmentCompleteAction = createAction(
  "[Sample] Remove Attachment Complete",
  props<{ attachmentId: string }>()
);
export const removeAttachmentFailedAction = createAction(
  "[Sample] Remove Attachment Failed"
);

export const changePageAction = createAction(
  "[Sample] Change Page",
  props<{ page: number; limit: number }>()
);

export const changeDatasetsPageAction = createAction(
  "[Sample] Change Datasets Page",
  props<{ page: number; limit: number }>()
);

export const sortByColumnAction = createAction(
  "[Sample] Sort By Column",
  props<{ column: string; direction: string }>()
);

export const setTextFilterAction = createAction(
  "[Sample] Set Text Filter",
  props<{ text: string }>()
);
