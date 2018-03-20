import { Action, ActionReducer } from '@ngrx/store';
import { ProposalsState, initialProposalsState } from '../state/proposals.store';

import { SelectProposalAction, SELECT_PROPOSAL } from '../actions/proposals.actions';

export function proposalsReducer(
    state: ProposalsState = initialProposalsState,
    action: Action
): ProposalsState {
    switch (action.type) {
        case SELECT_PROPOSAL:
            const selectedId = (action as SelectProposalAction).proposalId;
            return {...state, selectedId};
        default:
            return state;
    }
};
