import { createAction, props } from "@ngrx/store";

export const createDeposition = createAction("[OneDep] Create Deposition");

export const createDepositionSuccess = createAction(
  "[OneDep] Create Deposition Complete",
  props<{ depID: string }>(),
);

export const createDepositionFailure = createAction(
  "[OneDep] Create Deposition Failure",
);

// export const sendFile = createAction(
//   "[OneDep] Send File",
//   props<{ depID: string; form: FormData; fileType: string }>()
// );

// export const sendFile = createAction(
//   "[OneDep] Send File",
//   props<{ depID: string; form: FormData; fileType: string }>()
// );

// export const sendFileSuccess = createAction(
//   "[OneDep] Send File Success",
//   props<{ fileType: string; res: any }>()
// );

// export const sendFileFailure = createAction(
//   "[OneDep] Send File Failure",
//   props<{ error: any }>()
// );

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
