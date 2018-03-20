import { Action } from '@ngrx/store';

export const SELECT_PROPOSAL = '[Proposals] Select Proposal';

export class SelectProposalAction implements Action {
    type = SELECT_PROPOSAL;
    constructor(readonly proposalId: string) {}
}
