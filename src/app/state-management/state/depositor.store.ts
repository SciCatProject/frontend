import { OneDepCreated, OneDepUserInfo } from "shared/sdk/models/OneDep";

export interface DepositorState {
  depositor: string | undefined;
  interactionError: Error | undefined;
}
export const initialDepositorState: DepositorState = {
  depositor: undefined,
  interactionError: undefined,
};

export interface OneDepState {
  depositionCreated: OneDepCreated | undefined;
  oneDepInteractionError: Error | undefined;
  fileIDs: string[] | undefined;
  currentFileID: string | undefined;
}

export const initialOneDepState: OneDepState = {
  // depositionInfo: undefined,
  depositionCreated: undefined,
  oneDepInteractionError: undefined,
  fileIDs: [],
  currentFileID: undefined,
};

export interface EmpiarSchemaState {
  schema: string | undefined;
  empiarInteractionError: Error | undefined;
}
export const initialEMPIARState: EmpiarSchemaState = {
  schema: undefined,
  empiarInteractionError: undefined,
};
