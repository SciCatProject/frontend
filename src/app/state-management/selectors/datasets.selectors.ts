import { Dataset } from 'state-management/models';

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { DatasetState } from '../state/datasets.store'

const getDatasetState = createFeatureSelector<DatasetState>('datasets');

/* Improved selectors are temporarily suffixed with 2 */

export const getDatasets2 = createSelector(
    getDatasetState,
    state => state.datasets
);

export const getSelectedSets2 = createSelector(
    getDatasetState,
    state => state.selectedSets2
)

export const getCurrentPage2 = createSelector(
    getDatasetState,
    state => state.currentPage2
);

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
)

export const getFilterValues = (state: any) => state.root.datasets.filterValues;
export const getActiveFilters = (state: any) => state.root.datasets.activeFilters;
export const getText = (state: any) => state.root.datasets.activeFilters.text;

export const getDatasets = (state: any) => state.root.datasets.datasets;
export const getSelectedSets = (state: any) => state.root.datasets.selectedSets;

export const getLoading = (state: any) => state.root.datasets.loading;
export const getTotalSets = (state: any) => state.root.datasets.totalSets;

export const getCurrentSet = (state: any) => state.root.datasets.currentSet;
