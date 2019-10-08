import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProposalsState } from "../state/proposals.store";

export const getProposalsState = createFeatureSelector<ProposalsState>(
  "proposals"
);

export const getProposals = createSelector(
  getProposalsState,
  state => state.proposals
);

export const getCurrentProposal = createSelector(
  getProposalsState,
  state => state.currentProposal
);

export const getCurrentAttachments = createSelector(
  getCurrentProposal,
  proposal => proposal.attachments
);

export const getProposalDatasets = createSelector(
  getProposalsState,
  state => state.datasets
);

export const getProposalsCount = createSelector(
  getProposalsState,
  state => state.proposalsCount
);

export const getDatasetsCount = createSelector(
  getProposalsState,
  state => state.datasetsCount
);

export const getIsLoading = createSelector(
  getProposalsState,
  state => state.isLoading
);

export const getFilters = createSelector(
  getProposalsState,
  state => state.proposalFilters
);

export const getDatasetFilters = createSelector(
  getProposalsState,
  state => state.datasetFilters
);

export const getPage = createSelector(
  getFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getDatasetsPage = createSelector(
  getDatasetFilters,
  filters => {
    const { skip, limit } = filters;
    return skip / limit;
  }
);

export const getProposalsPerPage = createSelector(
  getFilters,
  filters => filters.limit
);

export const getDatasetsPerPage = createSelector(
  getDatasetFilters,
  filters => filters.limit
);

export const getFullqueryParams = createSelector(
  getFilters,
  filters => {
    const { text, skip, limit, sortField } = filters;
    const limits = { order: sortField, skip, limit };
    return { query: JSON.stringify({ text }), limits };
  }
);

export const getDatasetsQueryParams = createSelector(
  getDatasetFilters,
  filters => {
    const { text, skip, limit, sortField } = filters;
    const limits = { order: sortField, skip, limit };
    return { query: JSON.stringify({ text }), limits };
  }
);
