import { createAction, props } from "@ngrx/store";
import {
  OneDepUserInfo,
  OneDepCreated,
  UploadedFile,
} from "shared/sdk/models/OneDep";

export const createDepositionAction = createAction(
  "[OneDep] Create Deposition",
  props<{ deposition: OneDepUserInfo }>(),
);

export const createDepositionSuccess = createAction(
  "[OneDep] Create Deposition Complete",
  props<{ deposition: OneDepCreated }>(),
);

export const createDepositionFailure = createAction(
  "[OneDep] Create Deposition Failure",
  props<{ err: Error }>(),
);

export const sendFile = createAction(
  "[OneDep] Send File",
  props<{ depID: string; form: FormData }>(),
);

export const sendFileSuccess = createAction(
  "[OneDep] Send File Success",
  props<{ uploadedFile: UploadedFile }>(),
);

export const sendFileFailure = createAction(
  "[OneDep] Send File Failure",
  props<{ err: Error }>(),
);

// export const sendCoordFile = createAction(
//   "[OneDep] Send Coord File",
//   props<{ depID: string; form: FormData }>()
// );

// export const sendCoordFileSuccess = createAction(
//   "[OneDep] Send Coord File Success",
//   props<{ res: any }>()
// );

// export const sendCoordFileFailure = createAction(
//   "[OneDep] Send Coord File Failure",
//   props<{ error: any }>()
// );

// export const sendMetadata = createAction(
//   "[OneDep] Send Metadata",
//   props<{ depID: string; form: FormData }>()
// );

// export const sendMetadataSuccess = createAction(
//   "[OneDep] Send Metadata Success",
//   props<{ res: any }>()
// );

// export const sendMetadataFailure = createAction(
//   "[OneDep] Send Metadata Failure",
//   props<{ error: any }>()
// );
