import { Action, ActionReducer } from '@ngrx/store';
import { ProposalsState, initialProposalsState } from '../state/proposals.store';

import {
    SelectProposalAction, SELECT_PROPOSAL,
    FetchProposalsCompleteAction, FETCH_PROPOSALS_COMPLETE
} from '../actions/proposals.actions';

export function proposalsReducer(
    state: ProposalsState = initialProposalsState,
    action: Action
): ProposalsState {
    switch (action.type) {
        case SELECT_PROPOSAL:
            const selectedId = (action as SelectProposalAction).proposalId;
            return {...state, selectedId};
        case FETCH_PROPOSALS_COMPLETE:
            const list = (action as FetchProposalsCompleteAction).proposals;
            return {...state, list, hasFetched: true};
        default:
            return state;
    }
};
