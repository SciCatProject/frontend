import { Action } from '@ngrx/store';
import { Proposal } from '../models';

export const SELECT_PROPOSAL			= '[Proposals] Select Proposal';

export const FETCH_PROPOSALS    		= '[Proposals] Get Proposals';
export const FETCH_PROPOSALS_COMPLETE 	= '[Proposals] Get Proposals Complete';
export const FETCH_PROPOSALS_FAILED		= '[Proposals] Get Proposals Failed'

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

export type FetchProposalsOutcomeAction =
	FetchProposalsCompleteAction |
	FetchProposalsFailedAction;

export type ProposalsAction = 
    SelectProposalAction |
    FetchProposalsAction | FetchProposalsOutcomeAction;
