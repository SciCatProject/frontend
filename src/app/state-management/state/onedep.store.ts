import { OneDepCreated, OneDepUserInfo } from "shared/sdk/models/OneDep";

export interface OneDepState {
  // depositionInfo: OneDepUserInfo | undefined;

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
