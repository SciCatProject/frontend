import { Action, ActionReducer } from '@ngrx/store';
import { ProposalsState, initialProposalsState } from '../state/proposals.store';

import {
    ProposalsAction,
    SelectProposalAction, SELECT_PROPOSAL,
    FetchProposalsCompleteAction, FETCH_PROPOSALS_COMPLETE,
    FetchProposalCompleteAction, FETCH_PROPOSAL_COMPLETE,
    FetchDatasetsForProposalCompleteAction, FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,
} from '../actions/proposals.actions';

import { LogoutCompleteAction, LOGOUT_COMPLETE } from '../actions/user.actions';

export function proposalsReducer(
    state: ProposalsState = initialProposalsState,
    action: ProposalsAction | LogoutCompleteAction
): ProposalsState {
    switch (action.type) {
        case SELECT_PROPOSAL:
            const selectedId = (action as SelectProposalAction).proposalId;
            return {...state, selectedId};

        case FETCH_PROPOSALS_COMPLETE: {
            const list = (action as FetchProposalsCompleteAction).proposals;
            const proposals = list.reduce((proposals, proposal) =>
                ({...proposals, [proposal.proposalId]: proposal})
            , {});
            return {...state, proposals, hasFetched: true};
        }
        case FETCH_PROPOSAL_COMPLETE: {
            const proposal = (action as FetchProposalCompleteAction).proposal;
            const proposals = {...state.proposals, [proposal.proposalId]: proposal};
            return {...state, proposals};
        }
        case FETCH_DATASETS_FOR_PROPOSAL_COMPLETE: {
            const list = (action as FetchDatasetsForProposalCompleteAction).datasets;
            const datasets = list.reduce((datasets, dataset) => 
                ({...datasets, [dataset.pid]: dataset})
            , {});
            return {...state, datasets};
        }
        case LOGOUT_COMPLETE:
            return {...initialProposalsState};
            
        default:
            return state;
    }
};
