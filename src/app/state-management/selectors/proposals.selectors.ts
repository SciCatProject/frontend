import { createSelector, createFeatureSelector } from "@ngrx/store";
import { ProposalsState } from "../state/proposals.store";
import {
  selectHasFetchedSettings,
  selectTablesSettings,
} from "./user.selectors";
import { selectInstrumentWithIdAndLabel } from "./instruments.selectors";

const selectProposalsState = createFeatureSelector<ProposalsState>("proposals");

export const selectProposals = createSelector(
  selectProposalsState,
  (state) => state.proposals,
);

// selectEnrichedProposals enhances proposals with additional derived fields
// e.g. adds `instrumentName` (from instruments using `instrumentIds[0]`)
// for table display (configurable via frontend.config.json)
export const selectEnrichedProposals = createSelector(
  selectProposals,
  selectInstrumentWithIdAndLabel,
  (proposals, instruments) =>
    proposals.map((proposal) => ({
      ...proposal,
      instrumentName:
        instruments.find((inst) => inst._id === proposal.instrumentIds[0])
          ?.label || proposal.instrumentIds[0],
    })),
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
  // TODO: Check if this is still relevant because proposal doesn't have attachments in the schema
  (proposal) => (proposal ? (proposal as any).attachments : []),
);

export const selectProposalDatasets = createSelector(
  selectProposalsState,
  (state) => state.datasets,
);

export const selectProposalsCount = createSelector(
  selectProposalsState,
  (state) => state.proposalsCount,
);

export const selectProposalsfacetCounts = createSelector(
  selectProposalsState,
  (state) => state.facetCounts,
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
export const selectFilterByKey = (key: string) =>
  createSelector(
    selectProposalsState,
    (state) => state.proposalFilters.fields[key] || [],
  );

export const selectDatasetFilters = createSelector(
  selectProposalsState,
  (state) => state.datasetFilters,
);

export const selectDefaultProposalColumns = createSelector(
  selectProposalsState,
  (state) => state.columns,
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

export const selectRelatedProposalsPageViewModel = createSelector(
  selectProposalsState,
  ({ relatedProposals, relatedProposalsCount }) => ({
    relatedProposals,
    relatedProposalsCount,
  }),
);

export const selectRelatedProposalsFilters = createSelector(
  selectProposalsState,
  (state) => state.relatedProposalsFilters,
);

export const selectRelatedProposalsCurrentPage = createSelector(
  selectRelatedProposalsFilters,
  (filters) => filters.skip / filters.limit,
);

export const selectRelatedProposalsPerPage = createSelector(
  selectRelatedProposalsFilters,
  (filters) => filters.limit,
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

export const selectFullfacetParams = createSelector(
  selectFilters,
  (filters) => {
    const { skip, limit, sortField, ...theRest } = filters;

    const fields = restrictFilter(theRest.fields);

    return { fields };
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

export const selectProposalsWithCountAndTableSettings = createSelector(
  selectEnrichedProposals,
  selectProposalsCount,
  selectTablesSettings,
  selectHasFetchedSettings,
  (proposals, count, tablesSettings, hasFetchedSettings) => {
    return {
      proposals,
      count,
      tablesSettings,
      hasFetchedSettings,
    };
  },
);

export const selectProposalsFacetCountsWithInstrumentName = createSelector(
  selectProposalsfacetCounts,
  selectInstrumentWithIdAndLabel,
  (facets, instruments) => {
    const instrumentIds = instruments.map((inst) => {
      const matched = (facets.instrumentIds ?? []).find(
        (f) => f._id === inst._id,
      );
      return {
        _id: inst._id,
        label: inst.label ?? inst._id,
        count: matched?.count ?? 0,
      };
    });

    return { ...facets, instrumentIds };
  },
);

export const selectProposalsFacetCountsWithInstrumentNameByKey = (
  key: string,
) =>
  createSelector(
    selectProposalsFacetCountsWithInstrumentName,
    (facets) => facets[key] || [],
  );
