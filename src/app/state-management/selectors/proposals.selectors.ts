import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProposalsState } from '../state/proposals.store';
import { getDatasets } from './datasets.selectors';

export const getProposalsState = createFeatureSelector<ProposalsState>('proposals');

export const getProposalList = createSelector(
	getProposalsState,
	state => state.list
);

export const getSelectedProposalId = createSelector(
	getProposalsState,
	state => state.selectedId
);

export const getSelectedProposal = createSelector(
	getProposalList,
	getSelectedProposalId,
	(list, selectedId) => list.find(proposal => proposal.proposalId === selectedId) || null
);

export const getSelectedProposalDatasets = createSelector(
	getDatasets,
	getSelectedProposalId,
	(datasets, proposalId) => datasets.filter(dataset => dataset.proposalId === proposalId)
);
