import {
  FETCH_SAMPLES,
  FETCH_SAMPLES_COMPLETE,
  FETCH_SAMPLES_FAILED,
  FetchSamplesAction,
  FetchSamplesCompleteAction,
  FetchSamplesFailedAction
} from "./samples.actions";
import { Sample } from "../../shared/sdk/models";


describe("FetchSamplesAction", () => {
  it("should create an action", () => {
    const action = new FetchSamplesAction();
    expect({ ...action }).toEqual({ type: FETCH_SAMPLES });
  });
});

describe("FetchSamplesCompleteAction", () => {
  it("should create an action", () => {
    const samples = [new Sample()];
    const action = new FetchSamplesCompleteAction(samples);
    expect({ ...action }).toEqual({
      type: FETCH_SAMPLES_COMPLETE,
      samples
    });
  });
});

describe("FetchSamplesFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchSamplesFailedAction();
    expect({ ...action }).toEqual({ type: FETCH_SAMPLES_FAILED });
  });
});


