import { samplesReducer } from "./samples.reducer";
import { initialSampleState } from "../state/samples.store";
import {
  SelectSampleAction,
  AddAttachmentAction,
  DeleteAttachmentAction
} from "../actions/samples.actions";
import { Attachment } from "../models";

describe("SamplesReducer", () => {
  it("should set sample id", () => {
    const id = "my sample id";
    const action = new SelectSampleAction(id);
    const state = samplesReducer(initialSampleState, action);
    expect(state.selectedId).toEqual(id);
  });

  it("should set addingAttachment to true when adding attachment", () => {
    const attachment = new Attachment();
    const action = new AddAttachmentAction(attachment);
    const state = samplesReducer(initialSampleState, action);
    expect(state.addingAttachment).toEqual(true);
  });

  it("should set deletingAttachment to true when deleting attachment", () => {
    const proposalId = "123abc";
    const attachmentId = "abc123";
    const action = new DeleteAttachmentAction(proposalId, attachmentId);
    const state = samplesReducer(initialSampleState, action);
    expect(state.deletingAttachment).toEqual(true);
  });
});
