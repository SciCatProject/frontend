import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProposalsState } from '../state/proposals.store';
import { getDatasets } from './datasets.selectors';

const getProposalsState = createFeatureSelector<ProposalsState>('proposals');

const getProposals = createSelector(
	getProposalsState,
	state => state.proposals
);

export const getProposalList = createSelector(
	getProposals,
	proposals => Object.keys(proposals).map(id => proposals[id])
);

export const getSelectedProposalId = createSelector(
	getProposalsState,
	state => state.selectedId
);

export const getSelectedProposal = createSelector(
	getProposals,
	getSelectedProposalId,
	(proposals, selectedId) => proposals[selectedId] || null
);

export const getSelectedProposalDatasets = createSelector(
	getDatasets,
	getSelectedProposalId,
	(datasets, proposalId) => datasets.filter(dataset => dataset.proposalId === proposalId)
);
