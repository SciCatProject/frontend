import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProposalsState } from "../state/proposals.store";

const getProposalsState = createFeatureSelector<ProposalsState>("proposals");

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

export const getFilters = createSelector(
  getProposalsState,
  state => state.proposalFilters
);

export const getDateRangeFilter = createSelector(
  getFilters,
  filters => filters.dateRange
);

export const getHasAppliedFilters = createSelector(
  getFilters,
  filters =>
    filters.text !== "" ||
    (filters.dateRange &&
      (filters.dateRange.begin !== null || filters.dateRange.end !== null))
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

function restrictFilter(filter: object, allowedKeys?: string[]) {
  function isNully(value: any) {
    const hasLength = typeof value === "string" || Array.isArray(value);
    return value == null || (hasLength && value.length === 0);
  }

  const keys = allowedKeys || Object.keys(filter);
  return keys.reduce((obj, key) => {
    const val = filter[key];
    return isNully(val) ? obj : { ...obj, [key]: val };
  }, {});
}

export const getFullqueryParams = createSelector(
  getFilters,
  filters => {
    const { skip, limit, sortField, ...theRest } = filters;
    const limits = { order: sortField, skip, limit };
    const query = restrictFilter(theRest);
    return { query: JSON.stringify(query), limits };
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
