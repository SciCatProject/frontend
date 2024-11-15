import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProposalsState } from "../state/proposals.store";

const selectProposalsState = createFeatureSelector<ProposalsState>("proposals");

export const selectProposals = createSelector(
  selectProposalsState,
  (state) => state.proposals,
);

export const selectCurrentProposal = createSelector(
  selectProposalsState,
  (state) => state.currentProposal,
);

export const selectParentProposal = createSelector(
  selectProposalsState,
  (state) => state.parentProposal,
);

export const selectCurrentAttachments = createSelector(
  selectCurrentProposal,
  (proposal) => (proposal ? proposal.attachments : []),
);

export const selectProposalDatasets = createSelector(
  selectProposalsState,
  (state) => state.datasets,
);

export const selectProposalsCount = createSelector(
  selectProposalsState,
  (state) => state.proposalsCount,
);

export const selectDatasetsCount = createSelector(
  selectProposalsState,
  (state) => state.datasetsCount,
);

export const selectHasPrefilledFilters = createSelector(
  selectProposalsState,
  (state) => state.hasPrefilledFilters,
);

export const selectFilters = createSelector(
  selectProposalsState,
  (state) => state.proposalFilters,
);

export const selectTextFilter = createSelector(
  selectFilters,
  (filters) => filters.text,
);

export const selectDateRangeFilter = createSelector(
  selectFilters,
  (filters) => filters.dateRange,
);

export const selectHasAppliedFilters = createSelector(
  selectFilters,
  (filters) =>
    filters.text !== "" ||
    (filters.dateRange &&
      (filters.dateRange.begin !== null || filters.dateRange.end !== null)),
);

export const selectDatasetFilters = createSelector(
  selectProposalsState,
  (state) => state.datasetFilters,
);

export const selectPage = createSelector(selectFilters, (filters) => {
  const { skip, limit } = filters;
  return skip / limit;
});

export const selectDatasetsPage = createSelector(
  selectDatasetFilters,
  (filters) => {
    const { skip, limit } = filters;
    return skip / limit;
  },
);

export const selectProposalsPerPage = createSelector(
  selectFilters,
  (filters) => filters.limit,
);

export const selectDatasetsPerPage = createSelector(
  selectDatasetFilters,
  (filters) => filters.limit,
);

export const selectViewProposalPageViewModel = createSelector(
  selectCurrentProposal,
  selectProposalDatasets,
  selectDatasetsPage,
  selectDatasetsCount,
  selectDatasetsPerPage,
  (proposal, datasets, currentPage, datasetCount, datasetsPerPage) => ({
    proposal,
    datasets,
    currentPage,
    datasetCount,
    datasetsPerPage,
  }),
);

const restrictFilter = (filter: any, allowedKeys?: string[]) => {
  const isNully = (value: any) => {
    const hasLength = typeof value === "string" || Array.isArray(value);
    return value == null || (hasLength && value.length === 0);
  };

  const keys = allowedKeys || Object.keys(filter);
  return keys.reduce((obj, key) => {
    const val = filter[key];
    return isNully(val) ? obj : { ...obj, [key]: val };
  }, {});
};

export const selectFullqueryParams = createSelector(
  selectFilters,
  (filters) => {
    const { skip, limit, sortField, ...theRest } = filters;
    const limits = { order: sortField, skip, limit };
    const query = restrictFilter(theRest);
    return { query: JSON.stringify(query), limits };
  },
);

export const selectDatasetsQueryParams = createSelector(
  selectDatasetFilters,
  (filters) => {
    const { text, skip, limit, sortField } = filters;
    const limits = { order: sortField, skip, limit };
    return { query: JSON.stringify({ text }), limits };
  },
);
