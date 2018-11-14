import { Dataset, Proposal } from "../models";
import {
  FETCH_DATASETS_FOR_PROPOSAL,
  FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,
  FETCH_DATASETS_FOR_PROPOSAL_FAILED,
  FETCH_PROPOSAL,
  FETCH_PROPOSAL_COMPLETE,
  FETCH_PROPOSAL_FAILED,
  FETCH_PROPOSALS,
  FETCH_PROPOSALS_COMPLETE,
  FETCH_PROPOSALS_FAILED,
  FetchDatasetsForProposalAction,
  FetchDatasetsForProposalCompleteAction,
  FetchDatasetsForProposalFailedAction,
  FetchProposalAction,
  FetchProposalCompleteAction,
  FetchProposalFailedAction,
  FetchProposalsAction,
  FetchProposalsCompleteAction,
  FetchProposalsFailedAction,
  SELECT_PROPOSAL,
  SelectProposalAction
} from "./proposals.actions";

describe("SelectProposalAction", () => {
  it("should create an action", () => {
    const proposalId = "string";
    const action = new SelectProposalAction(proposalId);
    expect({ ...action }).toEqual({ type: SELECT_PROPOSAL, proposalId });
  });
});

describe("FetchProposalsAction", () => {
  it("should create an action", () => {
    const action = new FetchProposalsAction();
    expect({ ...action }).toEqual({ type: FETCH_PROPOSALS });
  });
});

describe("FetchProposalsCompleteAction", () => {
  it("should create an action", () => {
    const proposals = [new Proposal()];
    const action = new FetchProposalsCompleteAction(proposals);
    expect({ ...action }).toEqual({
      type: FETCH_PROPOSALS_COMPLETE,
      proposals
    });
  });
});

describe("FetchProposalsFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchProposalsFailedAction();
    expect({ ...action }).toEqual({ type: FETCH_PROPOSALS_FAILED });
  });
});

describe("FetchProposalAction", () => {
  it("should create an action", () => {
    const proposalId = "string";
    const action = new FetchProposalAction(proposalId);
    expect({ ...action }).toEqual({ type: FETCH_PROPOSAL, proposalId });
  });
});

describe("FetchProposalCompleteAction", () => {
  it("should create an action", () => {
    const proposal = new Proposal();
    const action = new FetchProposalCompleteAction(proposal);
    expect({ ...action }).toEqual({ type: FETCH_PROPOSAL_COMPLETE, proposal });
  });
});

describe("FetchProposalFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchProposalFailedAction();
    expect({ ...action }).toEqual({ type: FETCH_PROPOSAL_FAILED });
  });
});

describe("FetchDatasetsForProposalAction", () => {
  it("should create an action", () => {
    const proposalId = "string";
    const action = new FetchDatasetsForProposalAction(proposalId);
    expect({ ...action }).toEqual({
      type: FETCH_DATASETS_FOR_PROPOSAL,
      proposalId
    });
  });
});

describe("FetchDatasetsForProposalCompleteAction", () => {
  it("should create an action", () => {
    const datasets = [new Dataset()];
    const action = new FetchDatasetsForProposalCompleteAction(datasets);
    expect({ ...action }).toEqual({
      type: FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,
      datasets
    });
  });
});

describe("FetchDatasetsForProposalFailedAction", () => {
  it("should create an action", () => {
    const action = new FetchDatasetsForProposalFailedAction();
    expect({ ...action }).toEqual({ type: FETCH_DATASETS_FOR_PROPOSAL_FAILED });
  });
});
