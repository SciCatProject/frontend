import { Action } from "@ngrx/store";
import { Attachment, Dataset, Proposal } from "shared/sdk/models";

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

export const CHANGE_PAGE = "[Proposals] Change page";

export const SORT_PROPOSALS_BY_COLUMN = "[Proposals] Sort by Column";
export const FETCH_COUNT_PROPOSALS = "[Proposals] Fetch Count of Proposals";
export const FETCH_COUNT_FAILED = "[Proposals] Fetch Count of Proposals Failed";
export const FETCH_COUNT_PROPOSALS_SUCCESS =
  "[Proposals] Fetch Count of Proposals Success";

export const SEARCH_PROPOSALS = "[Proposals] Search Proposals";

export const ADD_ATTACHMENT = "[Proposals] Add Attachment";
export const ADD_ATTACHMENT_COMPLETE = "[Proposals] Add Attachment Complete";
export const ADD_ATTACHMENT_FAILED = "[Proposals] Add Attachment Failed";

export const DELETE_ATTACHMENT = "[Proposals] Delete Attachment";
export const DELETE_ATTACHMENT_COMPLETE =
  "[Proposals] Delete Attachment Complete";
export const DELETE_ATTACHMENT_FAILED = "[Proposals] Delete Attachment Failed";

export class SearchProposalAction implements Action {
  type = SEARCH_PROPOSALS;

  constructor(readonly query: string) {}
}

export class FetchCountOfProposals implements Action {
  readonly type = FETCH_COUNT_PROPOSALS;
  constructor() {}
}

export class FetchCountOfProposalsSuccess implements Action {
  readonly type = FETCH_COUNT_PROPOSALS_SUCCESS;
  constructor(readonly count: number) {}
}

export class FetchCountFailed implements Action {
  readonly type = FETCH_COUNT_FAILED;
}

export class SortProposalByColumnAction implements Action {
  readonly type = SORT_PROPOSALS_BY_COLUMN;
  constructor(readonly column: string, readonly direction: string) {}
}

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

export class ChangePageAction implements Action {
  type = CHANGE_PAGE;
  constructor(readonly page: number, readonly limit: number) {}
}

export class AddAttachmentAction implements Action {
  readonly type = ADD_ATTACHMENT;

  constructor(readonly attachment: Attachment) {}
}

export class AddAttachmentCompleteAction implements Action {
  readonly type = ADD_ATTACHMENT_COMPLETE;

  constructor(readonly attachment: Attachment) {}
}

export class AddAttachmentFailedAction implements Action {
  readonly type = ADD_ATTACHMENT_FAILED;

  constructor(readonly error: Error) {}
}

export class DeleteAttachmentAction implements Action {
  readonly type = DELETE_ATTACHMENT;

  constructor(readonly proposalId: string, readonly attachmentId: string) {}
}

export class DeleteAttachmentCompleteAction implements Action {
  readonly type = DELETE_ATTACHMENT_COMPLETE;

  constructor(readonly attachmentId: string) {}
}

export class DeleteAttachmentFailedAction implements Action {
  readonly type = DELETE_ATTACHMENT_FAILED;

  constructor(readonly error: Error) {}
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

export type AddProposalAttachmentOutcomeActions =
  | AddAttachmentCompleteAction
  | AddAttachmentFailedAction;

export type DeleteProposalAttachmentOutcomeActions =
  | DeleteAttachmentCompleteAction
  | DeleteAttachmentFailedAction;

export type ProposalsAction =
  | SelectProposalAction
  | FetchProposalsAction
  | FetchProposalsOutcomeAction
  | FetchProposalAction
  | FetchProposalOutcomeAction
  | FetchDatasetsForProposalAction
  | FetchDatasetsForProposalOutcomeAction
  | AddAttachmentAction
  | AddProposalAttachmentOutcomeActions
  | DeleteAttachmentAction
  | DeleteProposalAttachmentOutcomeActions;
