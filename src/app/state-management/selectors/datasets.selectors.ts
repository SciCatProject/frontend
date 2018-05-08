import { Dataset, DatasetFilters } from 'state-management/models';

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DatasetState } from '../state/datasets.store'

/* Improved, createSelector-based selectors are temporarily suffixed with 2 */

const getDatasetState = createFeatureSelector<DatasetState>('datasets');

export const getDatasets2 = createSelector(
    getDatasetState,
    state => state.datasets
);

export const getSelectedDatasets = createSelector(
    getDatasetState,
    state => state.selectedSets2
);

export const getPage = createSelector(
    getDatasetState,
    state => state.currentPage2
);

/*
TODO: create selector to derive filter object from state
*/

export const getRectangularRepresentation = createSelector(
    getDatasets2,
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

export const getFilterValues = (state: any) => state.root.datasets.filterValues;
export const getActiveFilters = (state: any) => state.root.datasets.activeFilters;
export const getText = (state: any) => state.root.datasets.activeFilters.text;

export const getDatasets = (state: any) => state.root.datasets.datasets;
export const getSelectedSets = (state: any) => state.root.datasets.selectedSets;

export const getLoading = (state: any) => state.root.datasets.loading;
export const getTotalSets = (state: any) => {
  if ('all' in state.root.datasets.filterValues &&
    state.root.datasets.filterValues['all'].length > 0) {
    return state.root.datasets.filterValues['all'][0].totalSets;
  } else {
    return 0
  }
}
export const getCurrentSet = (state: any) => state.root.datasets.currentSet;
