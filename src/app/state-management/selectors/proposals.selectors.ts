import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProposalsState } from "../state/proposals.store";
// import { getDatasets } from './datasets.selectors';

const getProposalsState = createFeatureSelector<ProposalsState>("proposals");

const getProposals = createSelector(
  getProposalsState,
  state => state.proposals
);

const getDatasets = createSelector(getProposalsState, state => state.datasets);

const getDatasetList = createSelector(getDatasets, datasets =>
  Object.keys(datasets).map(id => datasets[id])
);

export const getHasFetched = createSelector(
  getProposalsState,
  state => state.hasFetched
);

export const getProposalList = createSelector(getProposals, proposals =>
  Object.keys(proposals).map(id => proposals[id])
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
  getDatasetList,
  getProposalsState,
  (datasets, propState) => datasets.slice(propState.filters.skip, propState.filters.skip + propState.filters.limit)
  //getSelectedProposalId,
  /*(datasets, proposalId) =>
  //this filter is already done in the effect!?
    datasets.filter(dataset => dataset.proposalId === proposalId)*/
);

export const getdatasetCount = createSelector(
  getProposalsState,
  state => state.datasetCount
);


export const getPage = createSelector(
  getProposalsState,
  state => {
    const { skip, limit } = state.filters;
    return skip / limit;
  }
);
