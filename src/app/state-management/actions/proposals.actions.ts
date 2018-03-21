import { Action } from '@ngrx/store';
import { Proposal } from '../models';

export const SELECT_PROPOSAL			= '[Proposals] Select Proposal';

export const GET_PROPOSALS    			= '[Proposals] Get Proposals';
export const GET_PROPOSALS_COMPLETE    	= '[Proposals] Get Proposals Complete';
export const GET_PROPOSALS_FAILED		= '[Proposals] Get Proposals Failed'

export class SelectProposalAction implements Action {
    type = SELECT_PROPOSAL;
    constructor(readonly proposalId: string) {}
}

export class GetProposalsAction implements Action {
    type = GET_PROPOSALS;
}

export class GetProposalsCompleteAction implements Action {
    type = GET_PROPOSALS_COMPLETE;
    constructor(readonly proposals: Proposal[]) {}
}

export class GetProposalsFailedAction implements Action {
    type = GET_PROPOSALS_FAILED;
}

export type ProposalsAction = 
    SelectProposalAction |
    GetProposalsAction | GetProposalsCompleteAction | GetProposalsFailedAction;