import { Action } from "@ngrx/store";
import { Dataset, Proposal } from "../models";

export const SELECT_PROPOSAL = "[Proposals] Select Proposal";

export const FETCH_PROPOSALS = "[Proposals] Get Proposals";
export const FETCH_PROPOSALS_COMPLETE = "[Proposals] Get Proposals Complete";
export const FETCH_PROPOSALS_FAILED = "[Proposals] Get Proposals Failed";

export const FETCH_PROPOSAL = "[Proposals] Get Proposal";
export const FETCH_PROPOSAL_COMPLETE = "[Proposals] Get Proposal Complete";
export const FETCH_PROPOSAL_FAILED = "[Proposals] Get Proposal Failed";

export const FETCH_DATASETS_FOR_PROPOSAL =
  "[Proposals] Fetch Datasets for Proposal";
export const FETCH_DATASETS_FOR_PROPOSAL_COMPLETE =
  "[Proposals] Fetch Datasets for Proposal Complete";
export const FETCH_DATASETS_FOR_PROPOSAL_FAILED =
  "[Proposals] Fetch Datasets for Proposal Failed";

export class SelectProposalAction implements Action {
  type = SELECT_PROPOSAL;

  constructor(readonly proposalId: string) {}
}

export class FetchProposalsAction implements Action {
  type = FETCH_PROPOSALS;
}

export class FetchProposalsCompleteAction implements Action {
  type = FETCH_PROPOSALS_COMPLETE;

  constructor(readonly proposals: Proposal[]) {}
}

export class FetchProposalsFailedAction implements Action {
  type = FETCH_PROPOSALS_FAILED;
}

export class FetchProposalAction implements Action {
  type = FETCH_PROPOSAL;

  constructor(readonly proposalId: string) {}
}

export class FetchProposalCompleteAction implements Action {
  type = FETCH_PROPOSAL_COMPLETE;

  constructor(readonly proposal: Proposal) {}
}

export class FetchProposalFailedAction implements Action {
  type = FETCH_PROPOSAL_FAILED;
}

export class FetchDatasetsForProposalAction implements Action {
  type = FETCH_DATASETS_FOR_PROPOSAL;

  constructor(readonly proposalId: string) {}
}

export class FetchDatasetsForProposalCompleteAction implements Action {
  type = FETCH_DATASETS_FOR_PROPOSAL_COMPLETE;

  constructor(readonly datasets: Dataset[]) {}
}

export class FetchDatasetsForProposalFailedAction implements Action {
  type = FETCH_DATASETS_FOR_PROPOSAL_FAILED;
}

export type FetchProposalsOutcomeAction =
  | FetchProposalsCompleteAction
  | FetchProposalsFailedAction;

export type FetchProposalOutcomeAction =
  | FetchProposalCompleteAction
  | FetchProposalFailedAction;

export type FetchDatasetsForProposalOutcomeAction =
  | FetchDatasetsForProposalCompleteAction
  | FetchDatasetsForProposalFailedAction;

export type ProposalsAction =
  | SelectProposalAction
  | FetchProposalsAction
  | FetchProposalsOutcomeAction
  | FetchProposalAction
  | FetchProposalOutcomeAction
  | FetchDatasetsForProposalAction
  | FetchDatasetsForProposalOutcomeAction;
