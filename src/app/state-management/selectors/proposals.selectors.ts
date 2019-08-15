import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProposalsState } from "../state/proposals.store";

const getProposalsState = createFeatureSelector<ProposalsState>("proposals");

const getProposals = createSelector(
  getProposalsState,
  state => state.proposals
);

const getDatasets = createSelector(
  getProposalsState,
  state => state.datasets
);

const getDatasetList = createSelector(
  getDatasets,
  datasets => Object.keys(datasets).map(id => datasets[id])
);

export const getHasFetched = createSelector(
  getProposalsState,
  state => state.hasFetched
);

export const getProposalList = createSelector(
  getProposals,
  proposals => Object.keys(proposals).map(id => proposals[id])
);

export const getCurrentProposal = createSelector(
  getProposalsState,
  state => state.currentProposal
);

export const getSelectedProposalDatasets = createSelector(
  getDatasetList,
  getProposalsState,
  (datasets, propState) =>
    datasets.slice(
      propState.filters.skip,
      propState.filters.skip + propState.filters.limit
    )
);

export const getdatasetCount = createSelector(
  getProposalsState,
  state => state.datasetCount
);

export const getProposalCount = createSelector(
  getProposalsState,
  state => state.proposalCount
);

export const getPage = createSelector(
  getProposalsState,
  state => {
    const { skip, limit } = state.filters;
    return skip / limit;
  }
);

export const getProposalPage = createSelector(
  getProposalsState,
  state => {
    const { skip, limit } = state.filters;
    return skip / limit;
  }
);

export const getProposalsPerPage = createSelector(
  getProposalsState,
  state => {
    const { limit } = state.filters;
    return limit;
  }
);

export const getFilters = createSelector(
  getProposalsState,
  state => {
    const { skip, limit, sortField } = state.filters;
    const limits = { skip, limit, order: sortField };
    return { limits };
  }
);

export const getPropFilters = createSelector(
  getProposalsState,
  state => {
    const query = {
      text: state.propFilters.text
    };
    const limits = {
      order: state.propFilters.sortField,
      skip: state.propFilters.skip,
      limit: state.propFilters.limit
    };
    return {
      query: JSON.stringify(query),
      limits
    };
  }
);

export const getCurrentAttachments = createSelector(
  getCurrentProposal,
  proposal => proposal.attachments
);
