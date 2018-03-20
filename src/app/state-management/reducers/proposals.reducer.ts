import { Action, ActionReducer } from '@ngrx/store';
import { ProposalState, initialProposalState } from '../state/proposal.store';

export function proposalsReducer(
	state: ProposalState = initialProposalState,
	action: Action
): ProposalState {
	return initialProposalState;
};
