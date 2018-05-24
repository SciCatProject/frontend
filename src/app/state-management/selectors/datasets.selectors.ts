import { Dataset, DatasetFilters } from 'state-management/models';

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DatasetState } from '../state/datasets.store'

const getDatasetState = createFeatureSelector<DatasetState>('datasets');

export const getDatasets = createSelector(
    getDatasetState,
    state => state.datasets
);

export const getSelectedDatasets = createSelector(
    getDatasetState,
    state => state.selectedSets
);

export const isEmptySelection = createSelector(
    getSelectedDatasets,
    sets => sets.length === 0
);

export const getPage = createSelector(
    getDatasetState,
    state => {
        const {skip, limit} = state.filters;
        return skip / limit;
    }
);

export const getDatasetsPerPage = createSelector(
    getDatasetState,
    state => state.filters.limit
);

export const getRectangularRepresentation = createSelector(
    getDatasets,
    datasets => {
        const merged = datasets
            .reduce((result, current) => ({...result, ...current}));

        const empty = Object
            .keys(merged)
            .reduce((empty, key) => ({[key]: '', ...empty}), {});
            
        return datasets
            /*.map(dataset => Object -- Isn't this part taken care of by the CSV library?
                .keys(dataset)
                .reduce((result, key) => {
                    const value = JSON.stringify(dataset[key]);
                    return {...result, [key]: value};
                }, {})
            )*/
            .map(dataset => ({...empty, ...dataset}));
    }
);

export const getViewMode = createSelector(
    getDatasetState,
    state => state.mode
);

export const getIsLoading = createSelector(
    getDatasetState,
    state => state.datasetsLoading || state.facetCountsLoading
);

export const getTotalSets = createSelector(
    getDatasetState,
    state => state.totalCount
);

export const getFilters = createSelector(
    getDatasetState,
    state => state.filters
);

export const getSearchTerms = createSelector(
    getDatasetState,
    state => state.searchTerms
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

const getFacetCounts = createSelector(
    getDatasetState,
    state => state.facetCounts || {}
);

export const getLocationFacetCounts = createSelector(
    getFacetCounts,
    counts => counts.creationLocation || []
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
    counts => counts.keyword
);

export const getCreationTimeFacetCounts = createSelector(
    getFacetCounts,
    counts => counts.creationTime || []
);

// === Querying ===

// Returns copy with null/undefined values and empty arrays removed
function restrictFilter(filter: object, allowedKeys?: string[]) {
    function isNully(value: any) {
      const hasLength = typeof value === 'string' || Array.isArray(value);
      return value == null || hasLength && value.length === 0;
    }
  
    const keys = allowedKeys || Object.keys(filter);
    return keys.reduce((obj, key) => {
      const val = filter[key];
      return isNully(val) ? obj : {...obj, [key]: val};
    }, {});
}  

export const getFullqueryParams = createSelector(
    getFilters,
    filter => {
        const {skip, limit, sortField, ...theRest} = filter;
        const limits = {skip, limit, order: sortField};
        const query = restrictFilter(theRest);
  
        // ???
        delete query['mode'];
        delete query['initial'];
  
        return {query, limits};
    }
);
  
export const getFullfacetsParams = createSelector(
    getFilters,
    filter => {
        const fields = ['type', 'creationTime', 'creationLocation', 'ownerGroup', 'keywords'];
        const query = restrictFilter(filter, fields);
        return {query, fields};
    }
);
