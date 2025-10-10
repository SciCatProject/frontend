import { createAction, props } from "@ngrx/store";
import {
  OneDepUserInfo,
  OneDepCreated,
  UploadedFile,
  FileUpload,
  DepBackendVersion,
} from "shared/sdk/models/OneDep";

export const connectToDepositor = createAction(
  "[Depositor] Connect to Depositor",
);
export const connectToDepositorSuccess = createAction(
  "[Depositor] Successfully connected to Depositor",
  props<{ depositor: DepBackendVersion }>(),
);

export const connectToDepositorFailure = createAction(
  "[Depositor] Failed to connect to Depositor",
  props<{ err: Error }>(),
);
export const submitDeposition = createAction(
  "[OneDep] Submit Deposition",
  props<{ deposition: OneDepUserInfo; files: FileUpload[] }>(),
);
export const submitDepositionSuccess = createAction(
  "[OneDep] Completed Deposition Creation",
  props<{ deposition: OneDepCreated }>(),
);

export const submitDepositionFailure = createAction(
  "[OneDep] Failed to complete Deposition ",
  props<{ err: Error }>(),
);

export const accessEmpiarSchema = createAction("[EMPIAR] get EMPIAR schema");
export const accessEmpiarSchemaSuccess = createAction(
  "[EMPIAR] Successfully retrieved JSON schema for EMPIAR deposition",
  props<{ schema: any }>(),
);

export const accessEmpiarSchemaFailure = createAction(
  "[EMPIAR] Failed to retrieve JSON schema for EMPIAR deposition",
  props<{ err: Error }>(),
);

// export const createDepositionAction = createAction(
//   "[OneDep] Create Deposition",
//   props<{ deposition: OneDepUserInfo }>(),
// );

// export const createDepositionSuccess = createAction(
//   "[OneDep] Create Deposition Complete",
//   props<{ deposition: OneDepCreated }>(),
// );

// export const createDepositionFailure = createAction(
//   "[OneDep] Create Deposition Failure",
//   props<{ err: Error }>(),
// );

// export const sendFile = createAction(
//   "[OneDep] Send File",
//   props<{ depID: string; form: FormData }>(),
// );

// export const sendFileSuccess = createAction(
//   "[OneDep] Send File Success",
//   props<{ uploadedFile: UploadedFile }>(),
// );

// export const sendFileFailure = createAction(
//   "[OneDep] Send File Failure",
//   props<{ err: Error }>(),
// );

// export const sendCoordFile = createAction(
//   "[OneDep] Send Coord File",
//   props<{ depID: string; form: FormData }>(),
// );

// export const uploadFilesAction = createAction(
//   "[OneDep] Upload Files",
//   props<{ depID: string; files: FileUpload[] }>(),
// );

// export const sendCoordFileSuccess = createAction(
//   "[OneDep] Send Coord File Success",
//   props<{ uploadedFile: UploadedFile }>(),
// );

// export const sendCoordFileFailure = createAction(
//   "[OneDep] Send Coord File Failure",
//   props<{ error: Error }>(),
// );

// export const sendMetadata = createAction(
//   "[OneDep] Send Metadata",
//   props<{ depID: string; form: FormData }>(),
// );

// export const sendMetadataSuccess = createAction(
//   "[OneDep] Send Metadata Success",
//   props<{ uploadedFile: UploadedFile }>(),
// );

// export const sendMetadataFailure = createAction(
//   "[OneDep] Send Metadata Failure",
//   props<{ error: Error }>(),
// );