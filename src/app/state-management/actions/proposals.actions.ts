import { Action } from '@ngrx/store';
import { Proposal } from '../models';

export const SELECT_PROPOSAL			= '[Proposals] Select Proposal';

export const FETCH_PROPOSALS    		= '[Proposals] Get Proposals';
export const FETCH_PROPOSALS_COMPLETE 	= '[Proposals] Get Proposals Complete';
export const FETCH_PROPOSALS_FAILED		= '[Proposals] Get Proposals Failed'

export const FETCH_PROPOSAL             = '[Proposals] Get Proposal';
export const FETCH_PROPOSAL_COMPLETE    = '[Proposals] Get Proposal Complete';
export const FETCH_PROPOSAL_FAILED      = '[Proposals] Get Proposal Complete';

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
    constructor(readonly proposalId: string) {};
}

export class FetchProposalCompleteAction implements Action {
    type = FETCH_PROPOSAL_COMPLETE;
    constructor(readonly proposal: Proposal) {};
}

export class FetchProposalFailedAction implements Action {
    type = FETCH_PROPOSAL_FAILED;
}

export type FetchProposalsOutcomeAction =
	FetchProposalsCompleteAction |
    FetchProposalsFailedAction;
    
export type FetchProposalOutcomeAction =
    FetchProposalCompleteAction |
    FetchProposalFailedAction;

export type ProposalsAction = 
    SelectProposalAction |
    FetchProposalsAction | FetchProposalsOutcomeAction |
    FetchProposalAction | FetchProposalOutcomeAction;
