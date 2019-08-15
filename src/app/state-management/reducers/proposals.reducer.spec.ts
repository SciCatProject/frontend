import { proposalsReducer } from "./proposals.reducer";
import { initialProposalsState } from "../state/proposals.store";
import * as proposalsActions from "../actions/proposals.actions";
import { Attachment, Dataset, DatasetInterface, Proposal } from "../models";

describe("ProposalsReducer", () => {
  it("should set proposal id", () => {
    const id = "my proposal id";
    const action = new proposalsActions.SelectProposalAction(id);
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.selectedId).toEqual(id);
  });

  it("should have the correct number of datasets after fetch datasets complete", () => {
    const data: DatasetInterface = {
      owner: "",
      contactEmail: "",
      sourceFolder: "",
      creationTime: new Date(),
      type: "",
      ownerGroup: ""
    };

    const datasets = [
      new Dataset({ pid: "pid 1", ...data }),
      new Dataset({ pid: "pid 2", ...data }),
      new Dataset({ pid: "pid 3", ...data })
    ];

    const action = new proposalsActions.FetchDatasetsForProposalCompleteAction(
      datasets
    );
    const state = proposalsReducer(initialProposalsState, action);
    const ids = Object.keys(state.datasets);
    expect(ids.length).toEqual(3);
  });

  it("should set hasFetched to true after fetch proposals complete", () => {
    const action = new proposalsActions.FetchProposalsCompleteAction([]);
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.hasFetched).toEqual(true);
  });

  it("should set currentProposal", () => {
    const proposal = new Proposal();
    const action = new proposalsActions.FetchProposalCompleteAction(proposal);
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.currentProposal).toEqual(proposal);
  });

  it("should set addingAttachment to true when adding attachment", () => {
    const attachment = new Attachment();
    const action = new proposalsActions.AddAttachmentAction(attachment);
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.addingAttachment).toEqual(true);
  });

  it("should set deletingAttachment to true when deleting attachment", () => {
    const proposalId = "123abc";
    const attachmentId = "abc123";
    const action = new proposalsActions.DeleteAttachmentAction(
      proposalId,
      attachmentId
    );
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.deletingAttachment).toEqual(true);
  });
});
