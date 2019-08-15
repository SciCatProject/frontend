import {
  FETCH_SAMPLES,
  FETCH_SAMPLES_COMPLETE,
  FETCH_SAMPLES_FAILED,
  FetchSamplesAction,
  FetchSamplesCompleteAction,
  FetchSamplesFailedAction,
  AddAttachmentAction,
  ADD_ATTACHMENT,
  DeleteAttachmentAction,
  DELETE_ATTACHMENT,
  UpdateAttachmentCaptionAction,
  UPDATE_ATTACHMENT_CAPTION,
  UpdateAttachmentCaptionCompleteAction,
  UPDATE_ATTACHMENT_CAPTION_COMPLETE,
  UpdateAttachmentCaptionFailedAction,
  UPDATE_ATTACHMENT_CAPTION_FAILED
} from "./samples.actions";
import { Attachment, Sample } from "../../shared/sdk/models";


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

describe("AddAttachmentAction", () => {
  it("should create an action", () => {
    const attachment = new Attachment();
    const action = new AddAttachmentAction(attachment);
    expect({ ...action }).toEqual({ type: ADD_ATTACHMENT, attachment });
  });
});

describe("DeleteAttachmentAction", () => {
  it("should create an action", () => {
    const sampleId = "123abc";
    const attachmentId = "abc123";
    const action = new DeleteAttachmentAction(sampleId, attachmentId);
    expect({ ...action }).toEqual({
      type: DELETE_ATTACHMENT,
      sampleId,
      attachmentId
    });
  });
});

describe("UpdateAttachmentCaption", () => {
  it("should create an action", () => {
    const sampleId = "123abc";
    const attachmentId = "abc123";
    const caption = "New caption";
    const action = new UpdateAttachmentCaptionAction(
      sampleId,
      attachmentId,
      caption
    );
    expect({ ...action }).toEqual({
      type: UPDATE_ATTACHMENT_CAPTION,
      sampleId,
      attachmentId,
      caption
    });
  });
});

describe("UpdateAttachmentCompleteCaption", () => {
  it("should create an action", () => {
    const attachment = new Attachment();
    const action = new UpdateAttachmentCaptionCompleteAction(attachment);
    expect({ ...action }).toEqual({
      type: UPDATE_ATTACHMENT_CAPTION_COMPLETE,
      attachment
    });
  });
});

describe("UpdateAttachmentFailedCaption", () => {
  it("should create an action", () => {
    const error = new Error();
    const action = new UpdateAttachmentCaptionFailedAction(error);
    expect({ ...action }).toEqual({
      type: UPDATE_ATTACHMENT_CAPTION_FAILED,
      error
    });
  });
});
