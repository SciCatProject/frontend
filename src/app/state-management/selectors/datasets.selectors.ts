import { createSelector, createFeatureSelector } from "@ngrx/store";
import { DatasetState } from "../state/datasets.store";

const getDatasetState = createFeatureSelector<DatasetState>("datasets");

export const getCurrentDataset = createSelector(
  getDatasetState,
  state => state.currentSet
);

export const getCurrentOrigDatablocks = createSelector(
  getCurrentDataset,
  dataset => dataset.origdatablocks
);

export const getCurrentAttachments = createSelector(
  getCurrentDataset,
  dataset => dataset.datasetattachments
);

export const getCurrentDatablocks = createSelector(
  getCurrentDataset,
  dataset => dataset.datablocks
);

export const getDatasets = createSelector(
  getDatasetState,
  state => state.datasets
);

export const getSelectedDatasets = createSelector(
  getDatasetState,
  state => state.selectedSets
);

export const getIsEmptySelection = createSelector(
  getSelectedDatasets,
  sets => sets.length === 0
);

export const getPage = createSelector(getDatasetState, state => {
  const { skip, limit } = state.filters;
  return skip / limit;
});

export const getDatasetsPerPage = createSelector(
  getDatasetState,
  state => state.filters.limit
);

export const getRectangularRepresentation = createSelector(
  getDatasets,
  datasets => {
    const merged = datasets.reduce((result, current) => ({
      ...result,
      ...current
    }));

    const empty = Object.keys(merged).reduce(
      (empty, key) => ({ [key]: "", ...empty }),
      {}
    );

    return (
      datasets
        /*.map(dataset => Object -- Isn't this part taken care of by the CSV library?
                .keys(dataset)
                .reduce((result, key) => {
                    const value = JSON.stringify(dataset[key]);
                    return {...result, [key]: value};
                }, {})
            )*/
        .map(dataset => ({ ...empty, ...dataset }))
    );
  }
);

export const getTotalSets = createSelector(
  getDatasetState,
  state => state.totalCount
);

// === Filters ===

export const getFilters = createSelector(
  getDatasetState,
  state => state.filters
);

export const getTextFilter = createSelector(
  getFilters,
  filters => filters.text || ""
);

export const getLocationFilter = createSelector(
  getFilters,
  filters => filters.creationLocation
);

export const getGroupFilter = createSelector(
  getFilters,
  filters => filters.ownerGroup
);

export const getTypeFilter = createSelector(
  getFilters,
  filters => filters.type
);

export const getKeywordsFilter = createSelector(
  getFilters,
  filters => filters.keywords
);

export const getCreationTimeFilter = createSelector(
  getFilters,
  filters => filters.creationTime
);

export const getViewMode = createSelector(getFilters, filters => filters.modeToggle );

export const getHasAppliedFilters = createSelector(
  getFilters,
  filters =>
    filters.text !== "" ||
    filters.creationLocation.length > 0 ||
    filters.ownerGroup.length > 0 ||
    filters.type.length > 0 ||
    filters.keywords.length > 0 ||
    (filters.creationTime &&
      (filters.creationTime.begin !== null ||
        filters.creationTime.end !== null))
);

export const getScientificConditions = createSelector(
  getFilters,
  filters => filters.scientific
);

export const getScientificQuery = createSelector(
  getScientificConditions,
  conditions => {
    const and = conditions.map(cond => {
      const { relation, lhs, rhs } = cond;
      const dollar = {
        "EQUAL_TO_NUMERIC": "$eq",
        "EQUAL_TO_STRING": "$eq",
        "LESS_THAN": "$lt",
        "GREATER_THAN": "$gt"
      }[relation];
      return { [lhs]: { [dollar]: rhs }};
    });
    return { and };
  }
);

// === Facet Counts ===

const getFacetCounts = createSelector(
  getDatasetState,
  state => state.facetCounts || {}
);

export const getLocationFacetCounts = createSelector(
  getFacetCounts,
  counts => counts.creationLocation || []
);

export const getGroupFacetCounts = createSelector(
  getFacetCounts,
  counts => counts.ownerGroup || []
);

export const getTypeFacetCounts = createSelector(
  getFacetCounts,
  counts => counts.type
);

export const getKeywordFacetCounts = createSelector(
  getFacetCounts,
  counts => counts.keywords
);

export const getCreationTimeFacetCounts = createSelector(
  getFacetCounts,
  counts => counts.creationTime || []
);

// === Querying ===

// Returns copy with null/undefined values and empty arrays removed
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

export const getFullqueryParams = createSelector(getFilters, filter => {
  // dont query with modeToggle, its only in filters for persistent routing
  const { skip, limit, sortField, scientific, modeToggle, ...theRest } = filter;
  const limits = { skip, limit, order: sortField };
  const query = restrictFilter(theRest);
  return {
    query: JSON.stringify(query),
    limits
  };
});

export const getFullfacetsParams = createSelector(getFilters, filter => {
  const { skip, limit, sortField, scientific, ...theRest } = filter;
  const fields = restrictFilter(theRest);
  const facets = [
    "type",
    "creationTime",
    "creationLocation",
    "ownerGroup",
    "keywords"
  ]; 
  return { fields, facets };
});

// === Misc. ===

export const getSearchTerms = createSelector(
  getDatasetState,
  state => state.searchTerms
);

export const getKeywordsTerms = createSelector(
  getDatasetState,
  state => state.keywordsTerms
);

export const getSearchCaughtUp = createSelector(
  getSearchTerms,
  getTextFilter,
  (terms, text) => terms === text
);

export const getIsLoading = createSelector(
  getDatasetState,
  getSearchCaughtUp,
  (state, caughtUp) =>
    state.datasetsLoading || state.facetCountsLoading || !caughtUp
);

export const getHasPrefilledFilters = createSelector(
  getDatasetState,
  state => state.hasPrefilledFilters
);

export const getDatasetsInBatch = createSelector(
  getDatasetState,
  state => state.batch
);
